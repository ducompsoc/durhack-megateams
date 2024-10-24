import assert from "node:assert/strict"
import { ClientError, HttpStatus } from "@otterhttp/errors"
import { v7 as uuid } from "uuid"
import { z } from "zod"

import { requireLoggedIn, requireUserHasOne, requireUserIsAdmin } from "@server/common/decorators"
import { NullError } from "@server/common/errors"
import { UserRole } from "@server/common/model-enums"
import { QRCodes_category, type QrCode, type User, type Challenge, prisma, Quest_dependency_mode } from "@server/database"
import type { Middleware, Request, Response } from "@server/types"
import SocketManager from "@server/socket"

class QRCodesHandlers {
  static createQRPayloadSchema = z.object({
    name: z.string(),
    category: z.nativeEnum(QRCodes_category),
    pointsValue: z.number().nonnegative(),
    claimLimit: z.boolean(),
    state: z.boolean(),
    challengeId: z.number().optional(),
  })

  private async buildAndSaveQRCodeFromCreateAttributes(
    creator: User,
    create_attributes: z.infer<typeof QRCodesHandlers.createQRPayloadSchema>,
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
        category: challenge.category,
        state: true,
        challengeId: challenge_id
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

  async checkForQuestCompletion(user: User, challenge: Challenge, context: typeof prisma) {
    const quests = await context.quest.findMany({
      where: {
        challenges: { some: { challengeId: challenge.challengeId } },
        usersCompleted: { none: { keycloakUserId: user.keycloakUserId } }
      },
      include: {
        challenges: {
          include: {
            qrCodes: {
              include: {
                redeems: { where: { redeemerUserId: user.keycloakUserId } },
              },
            },
          },
        },
      }
    });

    for (const quest of quests) {
      const completedCount = quest.challenges.reduce(
        (count, challenge) => challenge.qrCodes.reduce((count, code) => count + code.redeems.length, count),
        0
      );
      const completed =
        quest.dependencyMode === Quest_dependency_mode.AND
          ? completedCount === quest.challenges.length
          : completedCount > 0;

      if (completed) {
        await context.quest.update({
          where: { questId: quest.questId },
          data: { usersCompleted: { connect: [{ keycloakUserId: user.keycloakUserId }] } }
        })

        if (quest.points > 0) {
          await context.point.create({ data: {
            value: quest.points,
            redeemerUserId: user.keycloakUserId
          } })
        }
      }
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
          await this.checkForQuestCompletion(user, qr.challenge, context as typeof prisma)
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

  @requireUserHasOne(UserRole.admin, UserRole.volunteer, UserRole.sponsor)
  getChallengeList(): Middleware {
    return async (_request: Request, response: Response): Promise<void> => {
      const now = new Date()
      // todo: this needs to be paginated
      const result = await prisma.challenge.findMany({
        where: { startTime: { lt: now }, expiryTime: { gt: now } },
        orderBy: { expiryTime: "asc" },
      })

      const payload = result.map((challenge) => ({
        id: challenge.challengeId,
        name: challenge.name,
        category: challenge.category,
        claim_limit: challenge.claimLimit,
        value: challenge.points,
        description: challenge.description,
        start_time: challenge.startTime,
        expiry_time: challenge.expiryTime,
      }))

      response.status(200)
      response.json({
        status: 200,
        message: "OK",
        challenges: payload,
      })
    }
  }

  static createChallengePayloadSchema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.nativeEnum(QRCodes_category),
    points: z.number().nonnegative(),
    claimLimit: z.boolean(),
    challengeId: z.number().optional(),
    startTime: z.date(),
    expiryTime: z.date(),
  })

  @requireUserIsAdmin()
  createChallenge(): Middleware {
    return async (request: Request, response: Response) => {
      const create_attributes = QRCodesHandlers.createChallengePayloadSchema.parse(request.body)

      const new_instance = await prisma.challenge.create({ data: create_attributes })

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: {
          ...new_instance
        },
      })
    }
  }
}

const qrCodesHandlers = new QRCodesHandlers()
export { qrCodesHandlers }
