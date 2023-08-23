import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@server/common/errors";
import Team from "@server/database/team";
import { requireUserIsAdmin, requireSelf } from "@server/common/decorators";

class TeamHandlers {
  @requireSelf
  async getMyTeam(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
  }

  @requireSelf
  async leaveMyTeam(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
  }

  @requireSelf
  async joinTeam(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
  }

  @requireSelf
  async createMyTeam(req: Request, res: Response) {
    if (!req.session.generatedTeamName) {
      throw new createHttpError.Conflict();
    }

    throw new createHttpError.NotImplemented();
  }

  async generateTeamName(req: Request, res: Response) {
    throw new createHttpError.NotImplemented();
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
