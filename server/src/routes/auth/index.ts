import { Router as ExpressRouter } from "express";
import passport from "passport";

import { handleMethodNotAllowed } from "@server/common/middleware";
import { handleGetCsrfToken } from "@server/auth/csrf";

import handlers from "./auth_handlers";

const auth_router = ExpressRouter();

auth_router
  .route("/login")
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureMessage: true,
    }),
    handlers.handleLoginSuccess
  )
  .all(handleMethodNotAllowed);

auth_router.route("/signup")
  .post(handlers.handleSignUp)
  .all(handleMethodNotAllowed);

auth_router
  .route("/setpassword")
  .post(handlers.handleSetPassword)
  .all(handleMethodNotAllowed);

auth_router
  .route("/csrf-token")
  .get(handleGetCsrfToken)
  .all(handleMethodNotAllowed);

auth_router
  .route("/user")
  .get(handlers.handleGetCurrentUser)
  .all(handleMethodNotAllowed);

export default auth_router;
