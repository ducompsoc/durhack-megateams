import { Router as ExpressRouter } from "express"
import passport from "passport"

import { handleGetCsrfToken } from "@server/auth/csrf"
import { handleFailedAuthentication, handleMethodNotAllowed } from "@server/common/middleware"

import { authHandlers } from "./auth_handlers"
import { rememberUserReferrerForRedirect } from "./rememberUserReferrerForRedirect"

export const authRouter = ExpressRouter()

authRouter
  .route("/login")
  .all(rememberUserReferrerForRedirect)
  .get(passport.authenticate("oauth2"))
  .all(handleMethodNotAllowed)

authRouter
  .route("/login/callback")
  .get(
    passport.authenticate("oauth2", {
      failureRedirect: "/",
      keepSessionInfo: true,
      session: true,
    }),
    authHandlers.handleLoginSuccess(),
  )
  .all(handleMethodNotAllowed)

authRouter.route("/csrf-token").get(handleGetCsrfToken).all(handleMethodNotAllowed)

authRouter
  .route("/socket-token")
  .get(authHandlers.handleGetSocketToken(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

authRouter.route("/logout").post(authHandlers.handleLogout()).all(handleMethodNotAllowed)
