import { Request, Response } from "express"
import createHttpError from "http-errors"
import { z } from "zod"
import { ValidationError as SequelizeValidationError } from "sequelize"

import User from "@server/database/tables/user"
import Point from "@server/database/tables/point"
import Area from "@server/database/tables/area"
import Megateam from "@server/database/tables/megateam"
import Team from "@server/database/tables/team"
import { NullError } from "@server/common/errors"
import { patch_user_payload_schema } from "@server/routes/users/user_handlers"
import prisma from '@server/database/prisma';
import { Prisma } from "@prisma/client"

class UserHandlers {
  async getUser(request: Request, response: Response) {
 
    const userId = request.user!.id;
    const payload = await prisma.user.getTotalPoints(userId)

    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }

  async patchUserDetails(request: Request, response: Response) {
    const parsed_payload = patch_user_payload_schema.parse(request.body)

    try {
      await prisma.user.update({
        where: {
          user_id: request.user!.id,
        },
        data: parsed_payload
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new createHttpError.BadRequest(error.message)
      }
      throw error
    }

    response.status(200)
    response.json({ status: response.statusCode, message: "OK" })
  }

  async getTeam(request: Request, response: Response) {

    const userData = await prisma.user.findUnique({
      where: { user_id: request.user!.id },
      include: {
        Team: {
          include: {
            User: { include: { Points: true } },
            Area: { include: { Megateam: true } },
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
        team.User!.map(User => ({
          name: User.preferred_name,
          points: prisma.user.getTotalPoints(userData.user_id),
        })) || [],
      megateam_name: team.Area?.Megateam?.megateam_name || null,
      join_code: team.join_code,
    }

    response.json({
      status: 200,
      message: "OK",
      team: payload,
    })
  }

  static join_code_schema = z
    .string()
    .length(4)
    .transform(val => parseInt(val, 16))
    .refine(val => !isNaN(val))

  async joinTeam(request: Request, response: Response) {

    const user = await prisma.user!.findUnique({
      where: { user_id: request.user!.id },
      include: { Team: true }
    });
    
    if (user?.Team) {
      throw new createHttpError.Conflict("You are already in a team!")
    }

    const provided_join_code = UserHandlers.join_code_schema.parse(request.body.join_code)
    const team = await prisma.team.findUnique({
      where: { join_code: provided_join_code }
    })

    if (!team) {
      throw new createHttpError.NotFound('Team not found')
    }

    if (!(await prisma.team.isJoinableTeam(team.team_id))) {
      throw new createHttpError.Conflict();
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: request.user!.id },
      data: { team_id: team.team_id }
    });
    
    response.json({
      status: 200,
      message: "OK",
    })
  }

  async leaveTeam(request: Request, response: Response) {
    
    const user = request.user as User

    const team = await user.$get("team")

    if (!team) {
      throw new createHttpError.NotFound("You are not in a team!")
    }

    await user.$set("team", null)

    response.json({
      status: 200,
      message: "OK",
    })
  }
}

const handlersInstance = new UserHandlers()
export default handlersInstance
