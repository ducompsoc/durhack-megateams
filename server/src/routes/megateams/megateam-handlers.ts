import createHttpError from "http-errors"
import { z } from "zod"
import { getMegateamsWithPointsAndMemberCount } from "@prisma/client/sql"

import type { Request, Response, Middleware } from "@server/types"
import { prisma } from "@server/database"

class MegateamsHandlers {
  static numberParser = z.coerce.number().catch(0)

  getMegateamsList(): Middleware {
    return async (req: Request, res: Response): Promise<void> => {
      const result = await prisma.$queryRawTyped(getMegateamsWithPointsAndMemberCount())

      const mostMembers = Math.max(
        ...result.map(megateam => MegateamsHandlers.numberParser.parse(megateam.memberCount)),
      )

      const payload = result.map(megateam => {
        const naivePoints = MegateamsHandlers.numberParser.parse(megateam.points)
        const members = MegateamsHandlers.numberParser.parse(megateam.memberCount)
        const scaledPoints = members > 0 ? naivePoints * mostMembers / members : 0
        return {
          megateam_name: megateam.megateamName,
          megateam_description: megateam.megateamDescription,
          points: scaledPoints
        }
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
