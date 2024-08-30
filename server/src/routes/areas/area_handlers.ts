import createHttpError from "http-errors"

import type { Middleware, Request, Response } from "@server/types";
import { requireUserIsAdmin } from "@server/common/decorators"
import Area from "@server/database/tables/area"
import Megateam from "@server/database/tables/megateam"

class AreaHandlers {
  @requireUserIsAdmin()
  getAreasList(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      const result = await Megateam.findAll({
        include: [Area],
      })

      response.json({
        status: 200,
        message: "OK",
        megateams: result,
      })
    }
  }

  @requireUserIsAdmin()
  createArea(): Middleware {
    return async (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireUserIsAdmin()
  getAreaDetails(): Middleware {
    return async (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireUserIsAdmin()
  patchAreaDetails(): Middleware {
    return async (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  @requireUserIsAdmin()
  deleteArea(): Middleware {
    return async (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }
}

const areaHandlers  = new AreaHandlers()
export { areaHandlers }
