import { Request, Response } from "express";
import createHttpError from "http-errors";
import { Sequelize } from "sequelize";

import Megateam from "@server/database/tables/megateam";
import Area from "@server/database/tables/area";
import Team from "@server/database/tables/team";
import User from "@server/database/tables/user";
import Point from "@server/database/tables/point";


class MegateamHandlers {
  async getMegateamsList(req: Request, res: Response): Promise<void> {
    const result = await Megateam.findAll({
      attributes: [
        "megateam_name",
        "megateam_description",
        [
          Sequelize.fn("sum", Sequelize.col("areas.team.members.points.value")),
          "points",
        ],
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
    });

    const payload = result.map((megateam) => {
      const json = megateam.toJSON();
      json.points = json.points || 0;
      return json;
    });

    res.json({
      status: 200,
      message: "OK",
      megateams: payload,
    });
  }

  async createMegateam(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }

  async getMegateamDetails(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }

  async patchMegateamDetails(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }

  async deleteMegateam(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }
}

const handlersInstance = new MegateamHandlers();
export default handlersInstance;
