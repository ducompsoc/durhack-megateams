import { TokenType } from "@durhack/token-vault/lib"

import { getSession } from "@server/auth/session"
import TokenVault from "@server/auth/tokens"
import { requireLoggedIn } from "@server/common/decorators"
import type { Middleware, Request, Response } from "@server/types"

class AuthHandlers {
  handleLoginSuccess(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      if (!request.user) {
        await response.redirect("/")
        return
      }

      const session = await getSession(request, response)
      if (session.redirectTo != null) {
        const redirectTo = session.redirectTo
        session.redirectTo = undefined
        await response.redirect(redirectTo)
        return
      }

      // todo: if the user has 'volunteer' or 'admin' role, redirect to /volunteer

      await response.redirect("/hacker")
      return
    }
  }

  handleLogout(): Middleware {
    return async (request: Request, response: Response) => {
      const session = await getSession(request, response)
      await session.destroy()
      response.status(200)
      response.json({ status: response.statusCode, message: "OK" })
    }
  }

  @requireLoggedIn()
  handleGetSocketToken(): Middleware {
    return async (request: Request, response: Response) => {
      const token = await TokenVault.createToken(TokenType.accessToken, request.user!, {
        scope: ["socket:state"],
        lifetime: 1800,
        claims: {
          client_id: "megateams-socket",
        },
      })
      response.status(200)
      response.json({ status: 200, message: "Token generation OK", token })
    }
  }
}

const authHandlers = new AuthHandlers()
export { authHandlers }
