import createHttpError from "http-errors"
import { NextFunction, Request, Response } from "express"
import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator"
import { z } from "zod"
import { ValidationError as SequelizeValidationError } from "sequelize"
import { getRandomValues } from "crypto"

import { NullError } from "@server/common/errors"
import { requireUserIsAdmin, requireLoggedIn } from "@server/common/decorators"
import sequelize from "@server/database"
import Team from "@server/database/tables/team"
import User from "@server/database/tables/user"
import Area from "@server/database/tables/area"
import Megateam from "@server/database/tables/megateam"
import Point from "@server/database/tables/point"

class TeamHandlers {
  static join_code_schema = z
    .string()
    .length(4)
    .transform(val => parseInt(val, 16))
    .refine(val => !isNaN(val))

  async generateTeamName(request: Request, response: Response): Promise<void> {
    request.session.generatedTeamName = uniqueNamesGenerator({
      dictionaries: [adjectives, adjectives, animals],
      length: 3,
      separator: "",
      style: "capital",
    })

    response.json({
      status: 200,
      message: "OK",
      name: request.session.generatedTeamName,
    })
  }

  async listTeamsAsAnonymous(this: void, _request: Request, response: Response): Promise<void> {
    const result = await Team.findAll({
      attributes: ["name", [sequelize.fn("sum", sequelize.col("members.points.value")), "points"]],
      include: [
        {
          model: User,
          include: [
            {
              model: Point,
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      group: "Team.team_id",
    })

    const payload = result.map(team => {
      const json = team.toJSON()
      json.points = (!Number.isNaN(json.points) ? parseInt(json.points) : 0) || 0
      return json
    })

    response.json({
      status: 200,
      message: "OK",
      teams: payload,
    })
  }

  @requireUserIsAdmin
  async listTeamsAsAdmin(_request: Request, response: Response): Promise<void> {
    const result = await Team.findAll({
      attributes: [
        "team_id",
        "name",
        "join_code",
        [sequelize.fn("sum", sequelize.col("members.points.value")), "points"],
        [sequelize.fn("count", sequelize.col("members.user_id")), "member_count"],
      ],
      include: [
        {
          model: User,
          include: [
            {
              model: Point,
              attributes: [],
            },
          ],
          attributes: [],
        },
        {
          model: Area,
          include: [
            {
              model: Megateam,
              attributes: ["megateam_id", "megateam_name"],
            },
          ],
          attributes: ["area_id", "area_name"],
        },
      ],
      group: "Team.team_id",
    })

    const payload = result.map(team => {
      const json = team.toJSON()
      json.points = (!Number.isNaN(json.points) ? parseInt(json.points) : 0) || 0
      json.member_count = (!Number.isNaN(json.member_count) ? parseInt(json.member_count) : 0) || 0
      return json
    })

    response.json({
      status: 200,
      message: "OK",
      teams: payload,
    })
  }

  @requireUserIsAdmin
  async patchTeamAsAdmin(request: Request, response: Response): Promise<void> {
    const { team_id } = response.locals
    if (typeof team_id !== "number") {
      throw new Error("Parsed `team_id` not found.")
    }
    const areaCode = z.number()

    const result = areaCode.safeParse(request.body.area_code)
    if (!result.success) throw new createHttpError.BadRequest()

    const team = await Team.findByPk(team_id, { rejectOnEmpty: new NullError() })
    team.area_id = result.data
    await team.save()

    response.json({
      status: 200,
      message: "OK",
    })
  }

  @requireUserIsAdmin
  async createTeamAsAdmin(_request: Request, _response: Response, next: NextFunction): Promise<void> {
    next()
  }

  @requireLoggedIn
  async createTeamAsHacker(request: Request, response: Response): Promise<void> {
    if (!request.session.generatedTeamName) {
      throw new createHttpError.Conflict()
    }

    const randomBuffer = new Uint16Array(1) // length 1, value 0-65535
    const randomValues = getRandomValues(randomBuffer) // Fill the buffer with random values
    let randomValue = randomValues[0]

    const transaction = await sequelize.transaction()

    try {
      const team = Team.build({
        name: request.session.generatedTeamName,
        join_code: randomValue,
      })

      let try_index = 0
      while (team.isNewRecord && try_index < 10) {
        try {
          await team.save({ transaction })
        } catch (error) {
          if (error instanceof SequelizeValidationError) {
            try_index += 1
            randomValue += try_index ** 2
            randomValue %= 65535
            team.join_code = randomValue
            continue
          }
          throw error
        }
      }

      if (team.isNewRecord) {
        throw new createHttpError.Conflict("Team creation failed because no available join-code was found. Try again.")
      }

      await (request.user as User).$set("team", team, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }

    response.json({
      status: 200,
      message: "OK",
    })
  }

  @requireUserIsAdmin
  async addUserToTeamAsAdmin(_request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }

  @requireUserIsAdmin
  async removeUserFromTeamAsAdmin(_request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }

  async getTeamDetails(_request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }

  async deleteTeam(_request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }
}

const handlersInstance = new TeamHandlers()
export default handlersInstance
