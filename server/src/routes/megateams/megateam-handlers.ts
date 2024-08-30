import createHttpError from "http-errors"
import { Sequelize } from "sequelize"
import { z } from "zod"

import type { Request, Response, Middleware } from "@server/types"
import Megateam from "@server/database/tables/megateam"
import Area from "@server/database/tables/area"
import Team from "@server/database/tables/team"
import User from "@server/database/tables/user"
import Point from "@server/database/tables/point"

class MegateamsHandlers {
  static numberParser = z.coerce.number().catch(0)

  getMegateamsList(): Middleware {
    return async (req: Request, res: Response): Promise<void> => {
      const result = await Megateam.findAll({
        attributes: [
          "megateam_name",
          "megateam_description",
          [Sequelize.fn("sum", Sequelize.col("areas.team.members.points.value")), "points"],
          [Sequelize.fn("count", Sequelize.col("areas.team.members.user_id")), "members"],
        ],
        include: [
          {
            model: Area,
            attributes: [],
            include: [
              {
                model: Team,
                attributes: [],
                include: [
                  {
                    model: User,
                    attributes: [],
                    include: [
                      {
                        model: Point,
                        attributes: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        group: "Megateam.megateam_id",
      })

      const most_members = Math.max(
        ...result.map(megateam => MegateamsHandlers.numberParser.parse(megateam.toJSON().members)),
      )

      const payload = result.map(megateam => {
        const plain_megateam = megateam.toJSON()

        const naive_points = MegateamsHandlers.numberParser.parse(plain_megateam.points)
        const members = MegateamsHandlers.numberParser.parse(plain_megateam.members)
        plain_megateam.points = Math.round((naive_points * most_members) / members)
        return plain_megateam
      })

      res.json({
        status: 200,
        message: "OK",
        megateams: payload,
      })
    }
  }

  createMegateam(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      throw new createHttpError.NotImplemented()
    }
  }

  getMegateamDetails(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      throw new createHttpError.NotImplemented()
    }
  }

  patchMegateamDetails(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      throw new createHttpError.NotImplemented()
    }
  }

  deleteMegateam(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      throw new createHttpError.NotImplemented()
    }
  }
}

const megateamsHandlers = new MegateamsHandlers()
export { megateamsHandlers }
