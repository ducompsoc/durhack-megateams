import { Request, Response } from "express";

import { requireUserIsAdmin } from "@server/common/decorators";
import Area from "@server/database/tables/area";
import Megateam from "@server/database/tables/megateam";
import createHttpError from "http-errors";

class AreaHandlers {
  @requireUserIsAdmin
  async getAreasList(req: Request, res: Response): Promise<void> {
    const result = await Megateam.findAll({
      include: [Area],
    });

    res.json({
      status: 200,
      message: "OK",
      megateams: result,
    });
  }

  @requireUserIsAdmin
  async createArea(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }

  @requireUserIsAdmin
  async getAreaDetails(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }

  @requireUserIsAdmin
  async patchAreaDetails(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }

  @requireUserIsAdmin
  async deleteArea(request: Request, response: Response): Promise<void> {
    throw new createHttpError.NotImplemented();
  }
}

const handlersInstance = new AreaHandlers();
export default handlersInstance;
