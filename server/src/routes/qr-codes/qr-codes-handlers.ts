import createHttpError from "http-errors"
import { v4 as uuid } from "uuid"
import { z } from "zod"
import { Op } from "sequelize"

import type { Request, Response, Middleware } from "@server/types"
import { NullError, ValueError } from "@server/common/errors"
import { QRCategory, UserRole } from "@server/common/model-enums"
import sequelize from "@server/database"
import QRCode from "@server/database/tables/qr_code"
import Point from "@server/database/tables/point"
import User from "@server/database/tables/user"
import { requireLoggedIn, requireUserIsAdmin, requireUserIsOneOf } from "@server/common/decorators"
import { megateamsConfig } from "@server/config";

const presets = new Map(Object.entries(megateamsConfig.QRPresets))

const patch_fields = new Set(["state", "publicised"])

class QRCodesHandlers {
  static createQRPayload = z.object({
    name: z.string(),
    category: z.nativeEnum(QRCategory),
    points_value: z.number().nonnegative(),
    max_uses: z.number().nonnegative(),
    state: z.boolean(),
    start_time: z.date().or(
      z
        .string()
        .datetime()
        .transform(val => new Date(val)),
    ),
    expiry_time: z.date().or(
      z
        .string()
        .datetime()
        .transform(val => new Date(val)),
    ),
  })

  private async buildAndSaveQRCodeFromCreateAttributes(
    creator: User,
    create_attributes: z.infer<typeof QRCodesHandlers.createQRPayload>,
    publicised: boolean,
  ) {
    const publicisedFields = await this.getPublicisedFields(null, publicised)

    const payload = uuid()

    return await QRCode.create({
      payload,
      creator_id: creator.id,
      ...create_attributes,
      ...publicisedFields,
    })
  }

  @requireUserIsAdmin()
  createQRCode(): Middleware {
    return async (request: Request, response: Response) => {
      const create_attributes = QRCodesHandlers.createQRPayload.parse(request.body)
      const publicised = z.boolean().parse(request.body.publicised)

      const new_instance = await this.buildAndSaveQRCodeFromCreateAttributes(
        request.user as User,
        create_attributes,
        publicised,
      )

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: {
          ...new_instance.toJSON(),
          redemption_url: new_instance.getRedemptionURL(),
        },
      })
    }
  }

  @requireUserIsOneOf(UserRole.admin, UserRole.volunteer, UserRole.sponsor)
  usePreset(): Middleware {
    return async (request: Request, response: Response) => {
      const preset_id: string = request.params.preset_id
      const name = z.string().parse(request.body.name)

      if (!preset_id || !presets.has(preset_id) || !name) {
        throw new createHttpError.NotFound()
      }
      const preset = presets.get(preset_id)!

      const publicised = z.boolean().parse(request.body.publicised)

      const expiry = new Date()
      expiry.setMinutes(expiry.getMinutes() + preset.minutesValid)
      const create_attributes = {
        name: name,
        points_value: preset.points,
        max_uses: preset.uses,
        category: QRCategory.preset,
        state: true,
        start_time: new Date(),
        expiry_time: expiry,
      }

      const new_instance = await this.buildAndSaveQRCodeFromCreateAttributes(
        request.user as User,
        create_attributes,
        publicised,
      )

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: {
          ...new_instance.toJSON(),
          redemption_url: new_instance.getRedemptionURL(),
        },
      })
    }
  }

  @requireUserIsAdmin()
  getQRCodeList(): Middleware {
    return async (_request: Request, response: Response): Promise<void> => {
      const result = await QRCode.findAll({
        include: [Point, User],
        order: [["createdAt", "DESC"]],
      })

      const payload = result.map((code: QRCode) => ({
        id: code.id,
        name: code.name,
        category: code.category,
        scans: code.uses?.length || 0,
        max_scans: code.max_uses,
        creator: code.creator.preferred_name,
        value: code.points_value,
        start: code.start_time,
        end: code.expiry_time,
        enabled: code.state,
        uuid: code.payload,
        publicised: code.challenge_rank !== null,
        redemption_url: code.getRedemptionURL(),
      }))

      response.status(200)
      response.json({
        status: 200,
        message: "OK",
        codes: payload,
      })
    }
  }

  private async getPublicisedFields(existing_rank: typeof QRCode.prototype.challenge_rank, publicised: boolean) {
    const fields = { challenge_rank: existing_rank }

    if (!publicised) {
      fields.challenge_rank = null
    } else {
      if (!existing_rank) {
        const maxRank: number = await QRCode.max("challenge_rank")
        if (maxRank) {
          fields.challenge_rank = maxRank + 1
        } else {
          fields.challenge_rank = 1
        }
      }
    }

    return fields
  }

  @requireUserIsOneOf(UserRole.admin, UserRole.volunteer, UserRole.sponsor)
  patchQRCodeDetails(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      const { qr_code_id } = response.locals
      if (typeof qr_code_id !== "number") throw new Error("Parsed `qr_code_id` not found.")

      const invalid_fields = Object.keys(request.body).filter(key => !patch_fields.has(key))
      if (invalid_fields.length > 0) {
        throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`)
      }

      const found_code = await QRCode.findByPk(qr_code_id, {
        rejectOnEmpty: new NullError(),
      })

      let fields: { challenge_rank: number | null } | undefined

      if (Object.hasOwn(request.body, "publicised")) {
        fields = await this.getPublicisedFields(found_code.challenge_rank, request.body.publicised)
      }

      await found_code.update({ state: request.body.state, ...fields })

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: found_code,
      })
    }
  }

  @requireUserIsOneOf(UserRole.admin, UserRole.volunteer, UserRole.sponsor)
  getPresetsList(): Middleware {
    return (_request: Request, response: Response) => {
      response.status(200)
      response.json({
        status: 200,
        message: "OK",
        presets: Object.fromEntries(presets),
      })
    }
  }

  @requireUserIsAdmin()
  createPreset(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireUserIsAdmin()
  getPresetDetails(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireUserIsAdmin()
  deletePreset(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireLoggedIn()
  redeemQR(): Middleware {
    return async (request: Request, response: Response) => {
      if (!Object.hasOwn(request.body, "uuid")) {
        throw new createHttpError.BadRequest()
      }

      const transaction = await sequelize.transaction()

      let qr: QRCode
      try {
        qr = await QRCode.findOne({
          where: { payload: request.body.uuid },
          include: [Point],
          transaction: transaction,
          rejectOnEmpty: new createHttpError.BadRequest(),
        })

        if (!(await qr.canBeRedeemed(request.user!))) throw new createHttpError.BadRequest()

        await Point.create({
          value: qr.points_value,
          origin_qrcode_id: qr.id,
          redeemer_id: (request.user as User).id,
          transaction: transaction,
        })

        await transaction.commit()
      } catch (error) {
        await transaction.rollback()
        throw error
      }

      response.json({
        status: 200,
        message: "OK",
        points: qr.points_value,
      })
    }
  }

  private async getChallengeList(_request: Request, response: Response, includeId: boolean) {
    const now = new Date()
    const challenges = await QRCode.findAll({
      where: {
        challenge_rank: { [Op.ne]: null },
        state: true,
        start_time: { [Op.lt]: now },
        expiry_time: { [Op.gt]: now },
      },
    })

    challenges.sort((a, b) => a.challenge_rank! - b.challenge_rank!)

    const data = challenges.map((challenge, i) => ({
      title: challenge.name,
      points: challenge.points_value,
      rank: i,
      ...(includeId ? { id: challenge.id } : {}),
    }))

    response.json({
      status: 200,
      message: "OK",
      challenges: data,
    })
  }

  @requireUserIsAdmin()
  getChallengeListAdmin(): Middleware {
    return async (request: Request, response: Response) => {
      await this.getChallengeList(request, response, true)
    }
  }

  getChallengeListAsAnonymous(): Middleware {
    return async (request: Request, response: Response) => {
      await this.getChallengeList(request, response, false)
    }
  }

  @requireUserIsAdmin()
  reorderChallengeList(): Middleware {
    return async (request: Request, response: Response) => {
      const challengeList = z.array(
        z.object({
          id: z.number(),
          rank: z.number(),
        }),
      )

      if (!Object.hasOwn(request.body, "challenges") || !challengeList.safeParse(request.body.challenges).success) {
        throw new createHttpError.BadRequest()
      }

      const transaction = await sequelize.transaction()

      try {
        await QRCode.update(
          { challenge_rank: null },
          {
            where: { challenge_rank: { [Op.not]: null } },
            transaction,
          },
        )

        for (const challenge of request.body.challenges) {
          await QRCode.update({ challenge_rank: challenge.rank }, { where: { qrcode_id: challenge.id }, transaction })
        }

        await transaction.commit()
      } catch (error) {
        await transaction.rollback()
        throw error
      }

      response.json({
        status: 200,
        message: "OK",
      })
    }
  }

  @requireUserIsAdmin()
  createChallenge(): Middleware {
    return async (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireUserIsAdmin()
  getQRCodeDetails(): Middleware {
    return async (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireUserIsAdmin()
  deleteQRCode(): Middleware {
    return async (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }
}

const qrCodesHandlers = new QRCodesHandlers()
export { qrCodesHandlers }
