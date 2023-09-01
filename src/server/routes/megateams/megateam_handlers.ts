import { Request, Response } from "express";

import Megateam from "@server/database/megateam";
import Area from "@server/database/area";
import Team from "@server/database/team";
import User from "@server/database/user";
import Point from "@server/database/point";
import sequelize from "@server/database";

class MegateamHandlers {
  async getMegateams(req: Request, res: Response) {
    const result = await Megateam.findAll({
      attributes: [
        "megateam_name",
        "megateam_description",
        [
          sequelize.fn("sum", sequelize.col("areas.team.members.points.value")),
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
      group: "megateam.megateam_id",
    });

    const payload = result.map((megateam) => {
      let json = megateam.toJSON();
      json.points = json.points || 0;
      return json;
    });

    res.json({
      status: 200,
      message: "OK",
      megateams: payload,
    });
  }
}

const handlersInstance = new MegateamHandlers();
export default handlersInstance;
