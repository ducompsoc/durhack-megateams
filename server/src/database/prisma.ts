import { PrismaClient, type Prisma } from '@prisma/client';
import createHttpError from 'http-errors';

import { megateamsConfig } from "@server/config";

export type Area = Prisma.AreaGetPayload<{ select: undefined }>
export type Megateam = Prisma.MegateamGetPayload<{ select: undefined }>
export type Point = Prisma.PointGetPayload<{ select: undefined }>
export type QRCode = Prisma.QRCodeGetPayload<{ select: undefined }>
export type Team = Prisma.TeamGetPayload<{ select: undefined }>
export type User = Prisma.UserGetPayload<{ select: undefined }>

export const prisma = new PrismaClient().$extends({
  name: 'prismaExtensions',
  model: {
    user: {
      async getTotalPoints(userId: number) {
        const user = await prisma.user.findUnique({
          where: { user_id: userId },
          include: { Points: true },
        });

        if (!user) {
          throw new createHttpError.NotFound();
        }
        return prisma.point.sumPoints(user) 
      },
    },
    point: {
      sumPoints(user: { Points: Point[] }) {
        const totalPoints =
          user.Points?.reduce(
            (total: number, point: { value: number }) => total + point.value,
            0
          ) || 0;
        return totalPoints
      }
    },
    team: {
      async isJoinableTeam(teamId: number) {
        const team_members = await prisma.user.count({
          where: {
            team_id: teamId,
          },
        });
        return team_members < megateamsConfig.maxTeamMembers;
      },
    },
  },
});
