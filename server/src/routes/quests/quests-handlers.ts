import { HttpStatus, ServerError } from "@otterhttp/errors"

import { requireUserHasOne, requireUserIsAdmin } from "@server/common/decorators"
import { UserRole } from "@server/common/model-enums"
import type { Middleware, Request, Response } from "@server/types"

class QuestsHandlers {
  @requireUserIsAdmin()
  getQuestListAdmin(): Middleware {
    return (request: Request, response: Response) => {
      throw new ServerError("", { statusCode: HttpStatus.NotImplemented, expected: true })
    }
  }

  @requireUserHasOne(UserRole.hacker)
  getQuestListHacker(): Middleware {
    return (request: Request, response: Response) => {
      throw new ServerError("", { statusCode: HttpStatus.NotImplemented, expected: true })
    }
  }

  @requireUserIsAdmin()
  createQuest(): Middleware {
    return (request: Request, response: Response) => {
      throw new ServerError("", { statusCode: HttpStatus.NotImplemented, expected: true })
    }
  }

  @requireUserIsAdmin()
  patchQuestDetails(): Middleware {
    return (request: Request, response: Response) => {
      throw new ServerError("", { statusCode: HttpStatus.NotImplemented, expected: true })
    }
  }
}

const questsHandlers = new QuestsHandlers()
export { questsHandlers }
