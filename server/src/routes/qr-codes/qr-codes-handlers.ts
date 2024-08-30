import createHttpError from "http-errors"
import { v4 as uuid } from "uuid"
import { z } from "zod"
import assert from "node:assert/strict";

import type { Request, Response, Middleware } from "@server/types"
import { NullError, ValueError } from "@server/common/errors"
import { QRCategory, UserRole } from "@server/common/model-enums"
import { prisma, type QrCode, type User } from "@server/database";
import { requireLoggedIn, requireUserIsAdmin, requireUserIsOneOf } from "@server/common/decorators"
import { megateamsConfig } from "@server/config";

const presets = new Map(Object.entries(megateamsConfig.QRPresets))

const patch_fields = new Set(["state", "publicised"])

class QRCodesHandlers {
  static createQRPayload = z.object({
    name: z.string(),
    category: z.nativeEnum(QRCategory),
    pointsValue: z.number().nonnegative(),
    maxUses: z.number().nonnegative(),
    state: z.boolean(),
    startTime: z.date().or(
      z
        .string()
        .datetime()
        .transform(val => new Date(val)),
    ),
    expiryTime: z.date().or(
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

    // todo: update to uuid v7
    const payload = uuid()

    return await prisma.qrCode.create({
      data: {
        payload: payload,
        creatorUserId: creator.keycloakUserId,
        ...create_attributes,
        ...publicisedFields,
      }
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
          ...new_instance,
          // todo: check prisma extension properties are not enumerable
          redemption_url: new_instance.redemptionUrl,
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
        pointsValue: preset.points,
        maxUses: preset.uses,
        category: QRCategory.preset,
        state: true,
        startTime: new Date(),
        expiryTime: expiry,
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
          ...new_instance,
          redemption_url: new_instance.redemptionUrl,
        },
      })
    }
  }

  @requireUserIsAdmin()
  getQRCodeList(): Middleware {
    return async (_request: Request, response: Response): Promise<void> => {
      const result = await prisma.qrCode.findMany({
        include: { redeems: true, creator: true },
        orderBy: { createdAt: "desc" },
      })

      const payload = result.map((code) => ({
        id: code.qrCodeId,
        name: code.name,
        category: code.category,
        scans: code.redeems.length,
        max_scans: code.maxUses,
        // todo: this used to be a preferred name
        creator: code.creator.keycloakUserId,
        value: code.pointsValue,
        start: code.startTime,
        end: code.expiryTime,
        enabled: code.state,
        uuid: code.payload,
        publicised: code.challengeRank !== null,
        redemption_url: code.redemptionUrl,
      }))

      response.status(200)
      response.json({
        status: 200,
        message: "OK",
        codes: payload,
      })
    }
  }

  private async getPublicisedFields(existing_rank: number | null, publicised: boolean) {
    if (!publicised) return { challenge_rank: null }
    if (existing_rank != null) return { challenge_rank: existing_rank }

    const maxRankResult = await prisma.qrCode.aggregate({
      _max: {
        challengeRank: true,
      }
    })
    const maxRank = maxRankResult._max.challengeRank
    return { challenge_rank: (maxRank ?? 0) + 1 }
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

      const found_code = await prisma.qrCode.findUnique({
        where: { qrCodeId: qr_code_id },
      })
      if (found_code == null) throw new NullError()

      let fields: { challenge_rank: number | null } | undefined

      if (Object.hasOwn(request.body, "publicised")) {
        fields = await this.getPublicisedFields(found_code.challengeRank, request.body.publicised)
      }

      await prisma.qrCode.update({
        where: { qrCodeId: qr_code_id },
        data: {
          state: request.body.state,
          ...fields,
        }
      })

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
      const user = request.user
      assert(user != null)

      let qr = null as (QrCode | null)
      await prisma.$transaction(async (context) => {
        qr = await context.qrCode.findUnique({
          where: { payload: request.body.uuid },
          include: { redeems: true },
        })
        if (qr == null) throw new createHttpError.BadRequest()

        const qrCanBeRedeemed = await qr.canBeRedeemed(user)
        if (!qrCanBeRedeemed) throw new createHttpError.BadRequest()

        await context.point.create({
          data: {
            value: qr.pointsValue,
            originQrCodeId: qr.qrCodeId,
            redeemerUserId: user.keycloakUserId,
          },
        })
      })

      assert(qr != null)

      response.json({
        status: 200,
        message: "OK",
        points: qr.pointsValue,
      })
    }
  }

  private async getChallengeList(_request: Request, response: Response, includeId: boolean) {
    const now = new Date()
    const challenges = await prisma.qrCode.findMany({
      where: {
        challengeRank: { not: null },
        state: true,
        startTime: { lt: now },
        expiryTime: { gt: now },
      },
      orderBy: {
        challengeRank: "asc",
      },
    })

    const data = challenges.map((challenge, i) => {
      const challengeRepresentation: {
        title: string,
        points: number,
        rank: number,
        id?: number,
      } = {
        title: challenge.name,
        points: challenge.pointsValue,
        rank: i,
      }
      if (includeId) challengeRepresentation.id = challenge.qrCodeId
      return challengeRepresentation
    })

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

  static reorderChallengeListPayloadSchema = z.array(
    z.object({
      id: z.number(),
      rank: z.number(),
    }),
  )

  @requireUserIsAdmin()
  reorderChallengeList(): Middleware {
    return async (request: Request, response: Response) => {

      if (!Object.hasOwn(request.body, "challenges")) throw new createHttpError.BadRequest()
      const challenges = QRCodesHandlers.reorderChallengeListPayloadSchema.parse(request.body.challenges)

      await prisma.$transaction([
        prisma.qrCode.updateMany({
          data: { challengeRank: null }
        }),
        ...challenges.map((challenge) => {
          return prisma.qrCode.update({
            where: { qrCodeId: challenge.id },
            data: { challengeRank: challenge.rank },
          })
        })
      ])

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
