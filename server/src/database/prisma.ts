import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import config from 'config';
import { config_schema } from '@server/common/schema/config';

const maxTeamMembers = config_schema.shape.megateams.shape.maxTeamMembers.parse(
  config.get('megateams.maxTeamMembers')
);

const prisma = new PrismaClient().$extends({
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

        const totalPoints =
          user.Points?.reduce(
            (total: number, point: { value: number }) => total + point.value,
            0
          ) || 0;

        return { ...user, points: totalPoints };
      },
    },
    team: {
      async isJoinableTeam(teamId: number) {
        const team_members = await prisma.user.count({
          where: {
            team_id: teamId,
          },
        });
        return team_members < maxTeamMembers;
      },
    },
  },
});

export default prisma;