import createHttpError from "http-errors";
import { Request, Response } from "express";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import { getRandomValues } from "crypto";
import { ValidationError as SequelizeValidationError } from "sequelize";
import { z } from "zod";

import { NullError } from "@server/common/errors";
import Team from "@server/database/team";
import { requireUserIsAdmin, requireSelf } from "@server/common/decorators";
import User from "@server/database/user";
import sequelize from "@server/database";
import Area from "@server/database/area";
import Megateam from "@server/database/megateam";
import Point from "@server/database/point";

class TeamHandlers {
  @requireSelf
  async getMyTeam(req: Request, res: Response) {
    const { user_id } = res.locals;
    if (typeof user_id !== "number") {
      throw new Error("Parsed `user_id` not found.");
    }

    const result = await User.findByPk(user_id, {
      include: [
        {
          model: Team,
          include: [
            User,
            {
              model: Area,
              include: [Megateam],
            },
          ],
        },
      ],
      rejectOnEmpty: new NullError(),
    });

    const team = result.team;
    if (!team) {
      return res.json({
        status: 200,
        message: "OK",
        team: null,
      });
    }

    const payload = {
      name: team.name,
      members: team.members?.map((member) => member.id) || [],
      megateam: team.area?.megateam.name || null,
      joinCode: team.join_code,
    };

    res.json({
      status: 200,
      message: "OK",
      team: payload,
    });
  }

  @requireSelf
  async leaveMyTeam(req: Request, res: Response) {
    const { user_id } = res.locals;
    if (typeof user_id !== "number") {
      throw new Error("Parsed `user_id` not found.");
    }

    await User.update(
      { team_id: null },
      {
        where: { user_id },
      }
    );

    res.json({
      status: 200,
      message: "OK",
    });
  }

  @requireSelf
  async joinTeam(req: Request, res: Response) {
    const { user_id } = res.locals;
    if (typeof user_id !== "number") {
      throw new Error("Parsed `user_id` not found.");
    }

    const joinCode = z
      .string()
      .refine((val) => val.length === 4)
      .transform((val) => parseInt(val, 16))
      .refine((val) => !isNaN(val));

    const result = joinCode.safeParse(req.body.join_code);
    if (!result.success) throw new createHttpError.BadRequest();

    let team = await Team.findOne({
      where: { join_code: result.data },
      rejectOnEmpty: new NullError(),
    });
    let user = await User.findByPk(user_id, { rejectOnEmpty: new NullError() });

    user.team_id = team.id;
    await user.save();

    res.json({
      status: 200,
      message: "OK",
    });
  }

  @requireSelf
  async createMyTeam(req: Request, res: Response) {
    const { user_id } = res.locals;
    if (typeof user_id !== "number") {
      throw new Error("Parsed `user_id` not found.");
    }

    if (!req.session.generatedTeamName) {
      throw new createHttpError.Conflict();
    }

    const randomBuffer = new Uint16Array(1); // length 1, value 0-65535
    const randomValues = getRandomValues(randomBuffer); // Fill the buffer with random values
    let randomValue = randomValues[0];

    const t = await sequelize.transaction();

    try {
      let team = new Team({
        name: req.session.generatedTeamName,
        join_code: randomValue,
      });

      let teamCreated = false;
      // Don't just keep trying forever, the user can always resend the request if this fails
      for (let i = 1; !teamCreated && i < 10; i++) {
        try {
          team.join_code = randomValue;
          await team.save();
          teamCreated = true;
        } catch (error) {
          if (error instanceof SequelizeValidationError) {
            randomValue += i ** 2;
            if (randomValue >= 65535) randomValue = 0;
          } else {
            throw error;
          }
        }
      }

      if (!teamCreated) throw new createHttpError.InternalServerError();

      let user = await User.findByPk(user_id, {
        rejectOnEmpty: new NullError(),
      });
      user.team_id = team.id;
      await user.save();

      await t.commit();

      res.json({
        status: 200,
        message: "OK",
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async generateTeamName(req: Request, res: Response) {
    req.session.generatedTeamName = uniqueNamesGenerator({
      dictionaries: [adjectives, adjectives, animals],
      length: 3,
      separator: "",
      style: "capital",
    });

    res.json({
      status: 200,
      message: "OK",
      name: req.session.generatedTeamName,
    });
  }

  async listTeamsDefault(req: Request, res: Response) {
    const result = await Team.findAll({
      attributes: [
        "team_id",
        "name",
        [sequelize.fn("sum", sequelize.col("members.points.value")), "points"],
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
      ],
      group: "team.team_id",
    });

    const payload = result.map((team) => {
      let json = team.toJSON();
      json.points = json.points || 0;
      return json;
    });

    res.json({
      status: 200,
      message: "OK",
      teams: payload,
    });
  }

  @requireUserIsAdmin
  async listTeamsAdmin(req: Request, res: Response) {
    const result = await Team.findAll({
      attributes: [
        "team_id",
        "name",
        "join_code",
        [sequelize.fn("sum", sequelize.col("members.points.value")), "points"],
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
      group: "team.team_id",
    });

    const payload = result.map((team) => {
      let json = team.toJSON();
      json.points = json.points || 0;
      return json;
    });

    res.json({
      status: 200,
      message: "OK",
      teams: payload,
    });
  }

  @requireUserIsAdmin
  async patchTeamAdmin(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
  }
}

const handlersInstance = new TeamHandlers();
export default handlersInstance;
