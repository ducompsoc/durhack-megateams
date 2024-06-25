import { Request, Response } from "express"

import { requireUserIsAdmin } from "@server/common/decorators"
import Area from "@server/database/tables/area"
import Megateam from "@server/database/tables/megateam"
import createHttpError from "http-errors"

class AreaHandlers {
  @requireUserIsAdmin
  async getAreasList(this: void, _request: Request, response: Response): Promise<void> {
    const result = await Megateam.findAll({
      include: [Area],
    })

    response.json({
      status: 200,
      message: "OK",
      megateams: result,
    })
  }

  @requireUserIsAdmin
  async createArea(this: void, _request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }

  @requireUserIsAdmin
  async getAreaDetails(this: void, _request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }

  @requireUserIsAdmin
  async patchAreaDetails(this: void, _request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }

  @requireUserIsAdmin
  async deleteArea(this: void, _request: Request, _response: Response): Promise<void> {
    throw new createHttpError.NotImplemented()
  }
}

const handlersInstance = new AreaHandlers()
export default handlersInstance
