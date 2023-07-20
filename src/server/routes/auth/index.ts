import { Request, Response, Router as ExpressRouter } from "express";
import passport from "passport";
import Local, { VerifyFunction } from "passport-local";
import { pbkdf2, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { randomBytes as cryptoRandomBytes } from "crypto";
import createHttpError from "http-errors";
import * as EmailValidator from "email-validator";

import User from "@/server/database/user";
import { NullError, ValueError } from "@/server/common/errors";
import { UserModel, UserIdentifierModel } from "@/server/common/models";
import { HandleMethodNotAllowed } from "@/server/common/middleware";

const promise_pbkdf2 = promisify(pbkdf2);
const promise_validate_email = promisify((email: string, callback: EmailValidator.AsyncCallback) => { return EmailValidator.validate_async(email, callback); } );

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}

function validatePassword(password: string): boolean {
  /**
   * Returns whether the password is permitted - it contains no illegal characters
   *
   * @param password - the password to validate
   * @returns whether or not the password is valid
   */
  return true;
}

async function hashPasswordText(password: string, salt: Buffer): Promise<Buffer> {
  /**
   * Returns hashed text for password storage/comparison.
   *
   * @param password - the text to hash
   * @param salt - the salt to hash with
   * @returns the hashed password bytes
   */
  const normalized_password = password.normalize();
  // hash the text, for 310,000 iterations, using the SHA256 algorithm with an output key (hash) length of 32 bytes
  return await promise_pbkdf2(normalized_password, salt, 310000, 32, "sha256");
}

async function checkPassword(user: User, password_attempt: string): Promise<boolean> {
  /**
   * Returns whether the password attempt is correct for the provided user.
   *
   * @param user - the user to compare against
   * @param password_attempt - the password attempt to check
   * @returns whether the password attempt matches the user's password hash
   */
  if (!(user.password_salt instanceof Buffer && user.hashed_password instanceof Buffer)) {
    throw new NullError("Password has not been set");
  }

  const hashed_password_attempt = await hashPasswordText(password_attempt, user.password_salt);
  return timingSafeEqual(hashed_password_attempt, user.hashed_password);
}

const localVerifyFunction: VerifyFunction = async function(username, password, callback) {
  /**
   * Verify function for Passport.js.
   *
   * @param username - email address to search for user with
   * @param password - password to attempt to log in as user with
   * @param callback - function to call with (error, user) when done
   */
  let user;
  try {
    user = await User.findOne({ where: { email: username }, rejectOnEmpty: new NullError() });
  } catch (error) {
    if (error instanceof NullError) {
      return callback(null, false, { message: "Incorrect username or password." });
    }
    return callback(error);
  }

  try {
    if (!await checkPassword(user, password)) {
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
  return callback(null, { id: user.id });
});

passport.deserializeUser(async function(identifier: UserIdentifierModel, callback) {
  if (typeof identifier?.id !== "number") {
    return callback(null, null);
  }
  try {
    return callback(null, await User.findByPk(identifier.id, { rejectOnEmpty: new NullError() }));
  } catch (error) {
    if (error instanceof NullError) return callback(null, null);
    return callback(error);
  }
});

const auth_router = ExpressRouter();

auth_router.route("/login")
  .post(passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true
  }))
  .all(HandleMethodNotAllowed);

auth_router.route("/signup")
  .post(async function(request: Request, response: Response) {
    if (request.user) {
      throw new createHttpError.BadRequest("You are already logged in!");
    }

    const { full_name, preferred_name, email, password } = request.body;

    if (typeof full_name !== "string" || full_name === "") {
      throw new createHttpError.BadRequest("Full name should be a non-empty string.");
    }

    if (typeof preferred_name !== "string" || preferred_name === "") {
      throw new createHttpError.BadRequest("Preferred name should be a non-empty string.");
    }

    if (typeof email !== "string" || !await promise_validate_email(email)) {
      throw new createHttpError.BadRequest("Email address needs to be mailable.");
    }

    if (typeof password !== "string" || !validatePassword(password)) {
      throw new createHttpError.BadRequest("Password should be a string containing no illegal characters.");
    }

    const password_salt = cryptoRandomBytes(16);
    const hashed_password = await hashPasswordText(password, password_salt);

    const payload = { full_name, preferred_name, email, password_salt, hashed_password };

    try {
      await User.createNewUser(payload);
    } catch (error) {
      if (error instanceof ValueError) throw new createHttpError.BadRequest("Invalid values provided.");
      throw error;
    }
  })
  .all(HandleMethodNotAllowed);

export default auth_router;