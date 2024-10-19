import assert from "node:assert/strict"
import { ClientError, HttpStatus, ServerError } from "@otterhttp/errors"
import { v7 as uuid } from "uuid"
import { z } from "zod"

import { requireLoggedIn, requireUserHasOne, requireUserIsAdmin } from "@server/common/decorators"
import { NullError } from "@server/common/errors"
import { QRCategory, UserRole } from "@server/common/model-enums"
import { type QrCode, type User, prisma } from "@server/database"
import type { Middleware, Request, Response } from "@server/types"
import SocketManager from "@server/socket"

class QRCodesHandlers {
  static createQRPayloadSchema = z.object({
    name: z.string(),
    category: z.nativeEnum(QRCategory),
    pointsValue: z.number().nonnegative(),
    claimLimit: z.boolean(),
    state: z.boolean(),
  })

  private async buildAndSaveQRCodeFromCreateAttributes(
    creator: User,
    create_attributes: Omit<z.infer<typeof QRCodesHandlers.createQRPayloadSchema>, "publicised">,
  ) {
    const payload = uuid()

    return await prisma.qrCode.create({
      data: {
        payload: payload,
        creatorUserId: creator.keycloakUserId,
        ...create_attributes,
      },
    })
  }

  static createQRCodePayloadSchema = z.object({})

  @requireUserIsAdmin()
  createQRCode(): Middleware {
    return async (request: Request, response: Response) => {
      const create_attributes = QRCodesHandlers.createQRPayloadSchema.parse(request.body)

      const new_instance = await this.buildAndSaveQRCodeFromCreateAttributes(
        request.user as User,
        create_attributes,
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

  @requireUserHasOne(UserRole.admin, UserRole.volunteer, UserRole.sponsor)
  useChallenge(): Middleware {
    return async (request: Request, response: Response) => {
      const { challenge_id } = response.locals
      if (typeof challenge_id !== "number") throw new Error("Parsed `challenge_id` not found.")

      const user = request.user
      assert(user != null)

      const challenge = await prisma.challenge.findUnique({ where: { challengeId: challenge_id } })
      if (challenge == null) {
        throw new ClientError("", { statusCode: HttpStatus.NotFound, expected: true })
      }

      const create_attributes = {
        name: challenge.name,
        pointsValue: challenge.points,
        claimLimit: challenge.claimLimit,
        category: QRCategory.preset,
        state: true,
      }

      let qr_code = await prisma.qrCode.findFirst({ where: { challengeId: challenge_id, creatorUserId: user.keycloakUserId } })
      if (qr_code == null) {
        qr_code = await this.buildAndSaveQRCodeFromCreateAttributes(
          request.user as User,
          create_attributes,
        )
      }

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: {
          ...qr_code,
          redemption_url: qr_code.redemptionUrl,
        },
      })
    }
  }

  @requireUserIsAdmin()
  getQRCodeList(): Middleware {
    return async (_request: Request, response: Response): Promise<void> => {
      // todo: this needs to be paginated
      const result = await prisma.qrCode.findMany({
        include: { redeems: true, creator: true },
        orderBy: { createdAt: "desc" },
      })

      const payload = result.map((code) => ({
        id: code.qrCodeId,
        name: code.name,
        category: code.category,
        scans: code.redeems.length,
        claim_limit: code.claimLimit,
        // todo: this used to be a preferred name
        creator: code.creator.keycloakUserId,
        value: code.pointsValue,
        enabled: code.state,
        uuid: code.payload,
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

  static patchQRCodeDetailsPayloadSchema = z.object({
    state: z.boolean().optional(),
  })

  @requireUserHasOne(UserRole.admin, UserRole.volunteer, UserRole.sponsor)
  patchQRCodeDetails(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      const { qr_code_id } = response.locals
      if (typeof qr_code_id !== "number") throw new Error("Parsed `qr_code_id` not found.")

      const { state } = QRCodesHandlers.patchQRCodeDetailsPayloadSchema.parse(request.body)

      const found_code = await prisma.qrCode.findUnique({
        where: { qrCodeId: qr_code_id },
      })
      if (found_code == null) throw new NullError()

      await prisma.qrCode.update({
        where: { qrCodeId: qr_code_id },
        data: { state },
      })

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: found_code,
      })
    }
  }

  static redeemQRPayloadSchema = z.object({
    uuid: z.string().uuid(),
  })

  @requireLoggedIn()
  redeemQR(): Middleware {
    return async (request: Request, response: Response) => {
      const { uuid: payload } = QRCodesHandlers.redeemQRPayloadSchema.parse(request.body)
      const user = request.user
      assert(user != null)

      let qr = null as QrCode | null
      await prisma.$transaction(async (context) => {
        qr = await context.qrCode.findUnique({
          where: { payload },
          include: { challenge: true },
        })
        if (qr == null) throw new ClientError()

        const qrCanBeRedeemed = await qr.canBeRedeemedByUser(user)
        if (!qrCanBeRedeemed) throw new ClientError()

        let value = qr.pointsValue
        if (qr.challenge != null) {
          value = qr.challenge.points
        }

        await context.point.create({
          data: {
            value,
            originQrCodeId: qr.qrCodeId,
            redeemerUserId: user.keycloakUserId,
          },
        })

        await context.qrCode.update({ data: { payload: uuid() }, where: { payload } })
      })

      assert(qr != null)
      await SocketManager.emitQR(qr.qrCodeId);

      response.json({
        status: 200,
        message: "OK",
        points: qr.pointsValue,
      })
    }
  }

  @requireUserIsAdmin()
  getChallengeList(): Middleware {
    return async (request: Request, response: Response) => {
      throw new ServerError("", { statusCode: HttpStatus.NotImplemented, expected: true })
    }
  }

  @requireUserIsAdmin()
  createChallenge(): Middleware {
    return async (request: Request, response: Response) => {
      throw new ServerError("", { statusCode: HttpStatus.NotImplemented, expected: true })
    }
  }
}

const qrCodesHandlers = new QRCodesHandlers()
export { qrCodesHandlers }
