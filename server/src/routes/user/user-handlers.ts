import { ClientError, HttpStatus } from "@otterhttp/errors"
import { z } from "zod"
import assert from "node:assert/strict";

import { prisma } from "@server/database"
import { patchUserPayloadSchema } from "@server/routes/users/users-handlers"
import type { Middleware, Request, Response } from "@server/types"

class UserHandlers {
  getUser(): Middleware {
    return async (request, response) => {
      assert(request.user)
      assert(request.userProfile)

      const payload = {
        id: request.user.keycloakUserId,
        email: request.userProfile.email,
        preferred_name: request.userProfile.preferred_name,
        roles: request.userProfile.groups,
        points: await prisma.user.getTotalPoints({
          where: request.user,
        }),
      }

      response.status(200)
      response.json({ status: response.statusCode, message: "OK", data: payload })
    }
  }

  patchUserDetails(): Middleware {
    return async (request, response) => {
      const parsed_payload = patchUserPayloadSchema.parse(request.body)

      await prisma.user.update({
        where: request.user!,
        data: parsed_payload,
      })

      response.status(200)
      response.json({ status: response.statusCode, message: "OK" })
    }
  }

  getTeam(): Middleware {
    return async (request, response) => {
      const user = await prisma.user.findUnique({
        where: request.user!,
        include: {
          team: {
            include: {
              members: { include: { points: true } },
              area: { include: { megateam: true } },
            },
          },
        },
      })

      const team = user?.team

      if (!team) {
        throw new ClientError("You are not in a team", { statusCode: HttpStatus.NotFound, expected: true })
      }

      const payload = {
        name: team.teamName,
        members:
          team.members.map((member) => ({
            // todo: include team member names in this payload using keycloak service account
            points: prisma.point.sumPoints(member.points),
          })) || [],
        megateam_name: team.area?.megateam.megateamName || null,
        join_code: team.joinCode,
      }

      response.json({
        status: 200,
        message: "OK",
        team: payload,
      })
    }
  }

  static joinTeamPayloadSchema = z.object({
    join_code: z
      .string()
      .length(4)
      .transform((val) => Number.parseInt(val, 16))
      .refine((val) => !Number.isNaN(val)),
  })

  joinTeam(): Middleware {
    return async (request: Request, response: Response) => {
      const user = await prisma.user.findUnique({
        where: request.user!,
        include: { team: true },
      })

      if (user!.team) {
        throw new ClientError("You are already in a team", { statusCode: HttpStatus.Conflict, expected: true })
      }

      const { join_code } = UserHandlers.joinTeamPayloadSchema.parse(request.body)
      const team = await prisma.team.findUnique({
        where: { joinCode: join_code },
      })

      if (team == null) {
        throw new ClientError("Join code not found", { statusCode: HttpStatus.NotFound, expected: true })
      }

      if (!(await prisma.team.isJoinableTeam({ where: team }))) {
        throw new ClientError("Team cannot be joined", { statusCode: HttpStatus.Conflict, expected: true })
      }

      await prisma.user.update({
        where: request.user!,
        data: { teamId: team.teamId },
      })

      response.json({
        status: 200,
        message: "OK",
      })
    }
  }

  leaveTeam(): Middleware {
    return async (request, response) => {
      const user = await prisma.user.findUnique({
        where: request.user!,
        include: { team: true },
      })

      const team = user?.team

      if (team == null) {
        throw new ClientError("You are not in a team", { statusCode: HttpStatus.NotFound, expected: true })
      }

      const updateUser = await prisma.user.update({
        where: request.user!,
        data: { teamId: null },
      })

      response.json({
        status: 200,
        message: "OK",
      })
    }
  }
}

const userHandlers = new UserHandlers()
export { userHandlers }
