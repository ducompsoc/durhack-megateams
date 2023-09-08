import { Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

import User from "@server/database/tables/user";
import Point from "@server/database/tables/point";
import Area from "@server/database/tables/area";
import Megateam from "@server/database/tables/megateam";
import Team from "@server/database/tables/team";
import {NullError} from "@server/common/errors";


class UserHandlers {
  async getUser(request: Request, response: Response) {
    throw new createHttpError.NotImplemented();
  }

  async getTeam(request: Request, response: Response) {
    const team = await (request.user as User).$get(
      "team",
      {
        include: [
          {
            model: User,
            include: [Point],
          },
          {
            model: Area,
            include: [Megateam],
          },
        ],
      },
    );

    if (!team) {
      throw new createHttpError.NotFound("You are not in a team!");
    }

    const payload = {
      name: team.name,
      members:
        team.members!.map((member) => ({
          name: member.preferred_name,
          points: Point.getPointsTotal(member.points || []),
        })) || [],
      megateam_name: team.area?.megateam.name || null,
      join_code: team.join_code,
    };

    response.json({
      status: 200,
      message: "OK",
      team: payload,
    });
  }

  static join_code_schema = z.string()
    .length(4)
    .transform((val) => parseInt(val, 16))
    .refine((val) => !isNaN(val));

  async joinTeam(request: Request, response: Response) {
    const user = request.user as User;

    if (await user.$get("team")) {
      throw new createHttpError.Conflict("You are already in a team!");
    }

    const provided_join_code = UserHandlers.join_code_schema.parse(request.body.join_code);
    const team = await Team.findOne({
      where: { join_code: provided_join_code },
      rejectOnEmpty: new NullError(),
    });

    if (!await team.isJoinable()) {
      throw new createHttpError.Conflict();
    }

    await user.$set("team", team);

    response.json({
      status: 200,
      message: "OK",
    });
  }

  async leaveTeam(request: Request, response: Response) {
    const user = request.user as User;

    const team = await user.$get("team");

    if (!team) {
      throw new createHttpError.NotFound("You are not in a team!");
    }

    await user.$remove("team", team);

    response.json({
      status: 200,
      message: "OK",
    });
  }
}

const handlersInstance = new UserHandlers();
export default handlersInstance;