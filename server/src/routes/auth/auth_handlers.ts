import { Request, Response } from "express";
import createHttpError from "http-errors";
import { randomBytes as cryptoRandomBytes } from "crypto";
import { z } from "zod";

import { NullError } from "@server/common/errors";
import User from "@server/database/tables/user";

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

  if (user.verify_code === null || user.verify_sent_at === null) {
    throw new createHttpError.BadRequest("Verify code not set.");
  }

  // verification codes are valid for 5 minutes (in milliseconds)
  if ((Date.now() - user.verify_sent_at.getSeconds()) > 300_000) {
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

const setPasswordPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  verify_code: z.string().length(6),
});

export async function handleSetPassword(request: Request, response: Response) {
  if (request.user) {
    throw new createHttpError.BadRequest("You are already logged in!");
  }

  const { email, password, verify_code } = setPasswordPayloadSchema.parse(request.body);

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
