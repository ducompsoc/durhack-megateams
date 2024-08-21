import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

const prisma = new PrismaClient().$extends({
  name: 'getUserTotalPoints',
  model: {
    user: {
      async getTotalPoints(userId: number) {
        const user = await prisma.user.findUnique({
          where: { user_id: userId },
          include: { Points: true },
        });

        if (user == null) {
          throw new createHttpError.NotFound()
        }
        const totalPoints = user.Points?.reduce((total: number, point: { value: number }) => total + point.value,0) || 0
        return { ...user, points: totalPoints }
      },
    },
  },
});

export default prisma;
