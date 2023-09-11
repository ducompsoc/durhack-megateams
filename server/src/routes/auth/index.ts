import { Router as ExpressRouter } from "express";
import passport from "passport";

import { handleGetCsrfToken } from "@server/auth/csrf";
import { handleMethodNotAllowed } from "@server/common/middleware";

import handlers from "./auth_handlers";


const auth_router = ExpressRouter();

auth_router.route("/login")
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

auth_router.route("/setpassword")
  .post(handlers.handleSetPassword)
  .all(handleMethodNotAllowed);

auth_router.route("/durhack-live")
  .get(passport.authenticate("oauth2"))
  .all(handleMethodNotAllowed);

auth_router.route("/durhack-live/callback")
  .get(
    function (request, response, next) {
      return passport.authenticate("oauth2", {
        failureRedirect: "/auth/login",
        keepSessionInfo: true,
      }).call(passport, request, response, next);
    },
    handlers.handleLoginSuccess,
  )
  .all(handleMethodNotAllowed);

auth_router.route("/csrf-token")
  .get(handleGetCsrfToken)
  .all(handleMethodNotAllowed);

export default auth_router;
