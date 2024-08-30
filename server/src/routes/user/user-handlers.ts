import createHttpError from "http-errors"
import { z } from "zod"

import { patch_user_payload_schema } from "@server/routes/users/users-handlers"
import { prisma } from '@server/database/prisma'
import type { Middleware, Request, Response } from "@server/types"

class UserHandlers {
  getUser(): Middleware {
    return async (request, response) => {
      const payload = {
        id: request.user!.id,
        email: request.user!.email,
        preferred_name: request.user!.preferred_name,
        role: request.user!.role,
        points: await prisma.user.getTotalPoints(request.user!.id),
      }
  
      response.status(200)
      response.json({ status: response.statusCode, message: "OK", data: payload })
    }
  }

  patchUserDetails(): Middleware {
    return async (request, response) => {
      const parsed_payload = patch_user_payload_schema.parse(request.body)

      await prisma.user.update({
        where: {
          user_id: request.user!.id,
        },
        data: parsed_payload
      })

      response.status(200)
      response.json({status: response.statusCode, message: "OK"})
    }
  }

  getTeam(): Middleware {
    return async (request, response) => {
      const userData = await prisma.user.findUnique({
        where: {user_id: request.user!.id},
        include: {
          Team: {
            include: {
              Members: {include: {Points: true}},
              Area: {include: {Megateam: true}},
            },
          },
        },
      });

      const team = userData?.Team

      if (!team) {
        throw new createHttpError.NotFound("You are not in a team!")
      }

      const payload = {
        name: team.team_name,
        members:
          team.Members.map(member => ({
            name: member.preferred_name,
            points: prisma.user.getTotalPoints(userData.user_id),
          })) || [],
        megateam_name: team.Area?.Megateam.megateam_name || null,
        join_code: team.join_code,
      }

      response.json({
        status: 200,
        message: "OK",
        team: payload,
      })
    }
  }

  static join_code_schema = z
    .string()
    .length(4)
    .transform(val => Number.parseInt(val, 16))
    .refine(val => !Number.isNaN(val))

  joinTeam(): Middleware {
    return async (request: Request, response: Response) => {
      const user = await prisma.user.findUnique({
        where: {user_id: request.user!.id},
        include: {Team: true}
      });

      if (user?.Team) {
        throw new createHttpError.Conflict("You are already in a team!")
      }

      const provided_join_code = UserHandlers.join_code_schema.parse(request.body.join_code)
      const team = await prisma.team.findUnique({
        where: {join_code: provided_join_code}
      })

      if (!team) {
        throw new createHttpError.NotFound('Team not found')
      }

      if (!(await prisma.team.isJoinableTeam(team.team_id))) {
        throw new createHttpError.Conflict();
      }

      const updateUser = await prisma.user.update({
        where: {user_id: request.user!.id},
        data: {team_id: team.team_id}
      });

      response.json({
        status: 200,
        message: "OK",
      })
    }
  }

  leaveTeam(): Middleware {
    return async (request, response) => {
      const user = await prisma.user.findUnique({
        where: {user_id: request.user!.id},
        include: {Team: true}
      });

      const team = user?.Team

      if (!team) {
        throw new createHttpError.NotFound("You are not in a team!")
      }

      const updateUser = await prisma.user.update({
        where: {user_id: request.user!.id},
        data: {team_id: null}
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
