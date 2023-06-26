import { Request, Response, Router as ExpressRouter } from "express";
import passport from "passport";
import Local, { VerifyFunction } from "passport-local";
import { handle_next_app_request } from "./next";
import User from "@/server/database/users";
import { NullError } from "@/server/common/errors";
import { pbkdf2, timingSafeEqual } from "crypto";
import { promisify } from "util";

const promise_pbkdf2 = promisify(pbkdf2);

async function hashPasswordText(password: string, salt: Buffer): Promise<Buffer> {
  const normalized_password = password.normalize();
  // hash the text, for 310,000 iterations, using the SHA256 algorithm with an output key (hash) length of 32 bytes
  return await promise_pbkdf2(normalized_password, salt, 310000, 32, "sha256");
}

async function checkPassword(user: User, password_attempt: string): Promise<boolean> {
  if (!(user.password_salt instanceof Buffer && user.hashed_password instanceof Buffer)) {
    throw new NullError("Password has not been set");
  }

  const hashed_password_attempt = await hashPasswordText(password_attempt, user.password_salt);
  return timingSafeEqual(hashed_password_attempt, user.hashed_password);
}

const localVerifyFunction: VerifyFunction = async function(username, password, callback) {
  let user;
  try {
    user = await User.findUserByEmail(username);
  } catch (error) {
    if (error instanceof NullError) {
      return callback(null, false, { message: "Incorrect username or password." });
    }
    return callback(error);
  }

  try {
    if (!checkPassword(user, password)) {
      return callback(null, false, { message: "Incorrect username or password." });
    }
  } catch (error) {
    return callback(error);
  }

  return callback(null, user);
};

const local_strategy = new Local.Strategy(localVerifyFunction);

passport.use("local", local_strategy);

passport.serializeUser(async function(user, callback) {

});

passport.deserializeUser(async function(id, callback) {

});

const auth_router = ExpressRouter();

auth_router.get("/login", function(request: Request, response: Response) {
  return handle_next_app_request(request, response);
});

auth_router.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true
}));

auth_router.get("/signup", function(request: Request, response: Response) {
  return handle_next_app_request(request, response);
});

auth_router.post("/signup", function(request: Request, response: Response) {

});

export default auth_router;