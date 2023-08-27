import createHttpError from "http-errors";
import { Request, Response } from "express";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import { getRandomValues } from "crypto";
import { ValidationError as SequelizeValidationError } from "sequelize";

import { NullError } from "@server/common/errors";
import Team from "@server/database/team";
import { requireUserIsAdmin, requireSelf } from "@server/common/decorators";
import User from "@server/database/user";
import sequelize from "@server/database";

class TeamHandlers {
  @requireSelf
  async getMyTeam(req: Request, res: Response) {
    const { user_id } = res.locals;
    if (typeof user_id !== "number") {
      throw new Error("Parsed `user_id` not found.");
    }

    const result = await User.findByPk(user_id, {
      include: [Team],
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
      members: team.members?.map((member) => member.id),
      megateam: team.area?.megateam.name,
      joinCode: team.join_code.toString(16).padStart(4, "0").toUpperCase(),
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

    const user = await User.findByPk(user_id, {
      rejectOnEmpty: new NullError(),
    });
    user.team_id = undefined;
    await user.save();

    res.json({
      status: 200,
      message: "OK",
    });
  }

  @requireSelf
  async joinTeam(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
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
    throw new createHttpError.NotImplemented();
  }

  @requireUserIsAdmin
  async listTeamsAdmin(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
  }

  @requireUserIsAdmin
  async patchTeamAdmin(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
  }
}

const handlersInstance = new TeamHandlers();
export default handlersInstance;
