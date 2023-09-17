import { Router as ExpressRouter } from "express";
import passport from "passport";

import { handleGetCsrfToken } from "@server/auth/csrf";
import { handleMethodNotAllowed } from "@server/common/middleware";

import handlers from "./auth_handlers";

const auth_router = ExpressRouter();

auth_router
  .route("/durhack-live")
  .get(passport.authenticate("oauth2"))
  .all(handleMethodNotAllowed);

auth_router
  .route("/durhack-live/callback")
  .get(
    passport.authenticate("oauth2", {
      failureRedirect: "/auth/login",
      keepSessionInfo: true,
      session: true,
    }),
    handlers.handleLoginSuccess
  )
  .all(handleMethodNotAllowed);

auth_router
  .route("/csrf-token")
  .get(handleGetCsrfToken)
  .all(handleMethodNotAllowed);

auth_router
  .route("/logout")
  .post(handlers.handleLogout)
  .all(handleMethodNotAllowed);

export default auth_router;
