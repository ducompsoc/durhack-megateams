import { Router as ExpressRouter } from "express";
import passport from "passport";
import Local from "passport-local";

import SequelizeUser from "@server/database/user";
import { NullError } from "@server/common/errors";
import { handleMethodNotAllowed } from "@server/common/middleware";

import { localVerifyFunction } from "./auth_util";
import { handleSignUp, handleSetPassword, handleLoginSuccess } from "./auth_handlers";


declare global {
  namespace Express {
    interface User extends SequelizeUser {}
  }
}

interface SerializedUser {
  id: number;
}

const local_strategy = new Local.Strategy(localVerifyFunction);

passport.use("local", local_strategy);

passport.serializeUser<SerializedUser>(async function(user: Express.User, callback) {
  return callback(null, { id: user.id });
});

passport.deserializeUser<SerializedUser>(async function(identifier, callback) {
  if (typeof identifier?.id !== "number") {
    return callback(null, null);
  }
  try {
    return callback(null, await SequelizeUser.findByPk(identifier.id, { rejectOnEmpty: new NullError() }));
  } catch (error) {
    if (error instanceof NullError) return callback(null, null);
    return callback(error);
  }
});

const auth_router = ExpressRouter();

auth_router.route("/login")
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureMessage: true
    }),
    handleLoginSuccess
  )
  .all(handleMethodNotAllowed);

auth_router.route("/signup")
  .post(handleSignUp)
  .all(handleMethodNotAllowed);

auth_router.route("/setpassword")
  .post(handleSetPassword)
  .all(handleMethodNotAllowed);

export default auth_router;