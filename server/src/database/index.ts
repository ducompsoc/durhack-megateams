import { type Prisma, PrismaClient } from "@prisma/client";
import createHttpError from "http-errors";

import { megateamsConfig } from "@server/config";

export type Area = Prisma.AreaGetPayload<{ select: undefined }>;
export type Megateam = Prisma.MegateamGetPayload<{ select: undefined }>
export type Point = Prisma.PointGetPayload<{ select: undefined }>
export type QrCode = Prisma.QrCodeGetPayload<{ select: undefined }> & {
  canBeRedeemed(user: Pick<User, "keycloakUserId">): Promise<boolean>
  redemptionUrl: string
}
export type Team = Prisma.TeamGetPayload<{ select: undefined }>
export type User = Prisma.UserGetPayload<{ select: undefined }>

const basePrisma = new PrismaClient()
export const prisma = basePrisma.$extends({
  name: "prismaExtensions",
  model: {
    user: {
      async getTotalPoints({ where }: { where: Prisma.Args<typeof basePrisma.user, "findUnique">["where"] }) {
        const user = await prisma.user.findUnique({
          where,
          select: { keycloakUserId: true },
          include: { points: true },
        });

        if (!user) throw new createHttpError.NotFound();
        return prisma.point.sumPoints(user.points);
      },
    },
    point: {
      sumPoints(points: Point[]) {
        return points.reduce(
          (total: number, point: Point) => total + point.value,
          0
        )
      },
    },
    team: {
      async isJoinableTeam({ where }: { where: { teamId: Team["teamId"] }}) {
        const team_members = await basePrisma.user.count({ where })
        return team_members < megateamsConfig.maxTeamMembers;
      },
    },
  },
  result: {
    qrCode: {
      canBeRedeemed: {
        needs: {
          qrCodeId: true,
          state: true,
          startTime: true,
          expiryTime: true,
          maxUses: true,
        },
        compute(qrCode) {
          return async (user: Pick<User, "keycloakUserId">): Promise<boolean> => {
            const now = new Date()

            if (now < qrCode.startTime) return false
            if (now >= qrCode.expiryTime) return false
            if (!qrCode.state) return false

            if (qrCode.maxUses != null) {
              const numberOfUses = await prisma.point.count({
                where: { originQrCodeId: qrCode.qrCodeId }
              })
              if ( numberOfUses >= qrCode.maxUses) return false
            }

            const redeemsByUser = await prisma.point.count({
              where: {
                originQrCodeId: qrCode.qrCodeId,
                redeemerUserId: user.keycloakUserId,
              },
            })
            return redeemsByUser === 0
          }
        }
      },
      redemptionUrl: {
        needs: { payload: true },
        compute(qrCode) {
          const redemptionUrlSearchParams = new URLSearchParams({ qr_id: qrCode.payload })
          return `${megateamsConfig.QRCodeRedemptionURL}?${redemptionUrlSearchParams.toString()}`
        }
      }
    }
  }
});
