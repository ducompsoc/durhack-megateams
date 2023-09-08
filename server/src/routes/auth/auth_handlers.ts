import { Request, Response } from "express";
import createHttpError from "http-errors";
import { randomBytes as cryptoRandomBytes } from "crypto";
import * as EmailValidator from "email-validator";

import { NullError } from "@server/common/errors";
import User from "@server/database/tables/tables/user";

import { hashPasswordText, validatePassword } from "./auth_util";
import * as process from "process";
import { sendStandardResponse } from "@server/common/response";

function ensureCorrectVerifyCode(
  user: User,
  verify_code_attempt: string
): void {
  if (process.env.MEGATEAMS_SKIP_EMAIL_VERIFICATION === "true") {
    return;
  }

  if (user.verify_code === undefined || user.verify_sent_at === undefined) {
    throw new createHttpError.BadRequest("Verify code not set.");
  }

  // verification codes are valid for 5 minutes (in milliseconds)
  if (Date.now() - user.verify_sent_at > 300_000) {
    throw new createHttpError.BadRequest("Verify code expired.");
  }

  if (user.verify_code !== verify_code_attempt) {
    throw new createHttpError.BadRequest("Verify code incorrect.");
  }
}

export async function handleLoginSuccess(request: Request, response: Response) {
  response.json({
    status: 200,
    message: "OK",
    user: {
      name: request.user?.preferred_name,
      loggedIn: request.user ? true : false,
      role: request.user?.role,
    },
  });
}

export async function handleGetCurrentUser(
  request: Request,
  response: Response
) {
  response.json({
    status: 200,
    message: "OK",
    user: {
      name: request.user?.preferred_name,
      loggedIn: request.user ? true : false,
      role: request.user?.role,
    },
  });
}

export async function handleSignUp(request: Request, response: Response) {
  throw new createHttpError.NotImplemented("Sign up handler not implemented");
}

export async function handleSetPassword(request: Request, response: Response) {
  if (request.user) {
    throw new createHttpError.BadRequest("You are already logged in!");
  }

  let email: unknown;
  let password: unknown;
  let verify_code: unknown;
  ({ email, password, verify_code } = request.body);

  if (typeof email !== "string" || !EmailValidator.validate(email)) {
    throw new createHttpError.BadRequest("Email address needs to be mailable.");
  }

  if (typeof password !== "string" || !validatePassword(password)) {
    throw new createHttpError.BadRequest(
      "Password should be a string containing no illegal characters."
    );
  }

  if (typeof verify_code !== "string") {
    throw new createHttpError.BadRequest("Verify code should be a string.");
  }

  let found_user: User;
  try {
    found_user = await User.findOne({
      where: { email },
      rejectOnEmpty: new NullError(),
    });
  } catch (error) {
    if (error instanceof NullError)
      throw new createHttpError.NotFound(
        "It looks like you didn't fill in the sign-up form - try another email address, or speak to a DurHack volunteer if you believe this is an error!"
      );
    throw error;
  }

  ensureCorrectVerifyCode(found_user, verify_code);

  const password_salt = cryptoRandomBytes(16);
  found_user.hashed_password = await hashPasswordText(password, password_salt);
  found_user.password_salt = password_salt;

  await found_user.save();

  sendStandardResponse(response, 200);
}
