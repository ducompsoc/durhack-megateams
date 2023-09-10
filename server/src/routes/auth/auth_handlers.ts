import { Request, Response } from "express";
import createHttpError from "http-errors";
import { randomBytes as cryptoRandomBytes } from "crypto";
import { z } from "zod";
import config from "config";

import { NullError } from "@server/common/errors";
import { hashPasswordText } from "@server/auth/passwords";
import { sendStandardResponse } from "@server/common/response";
import User from "@server/database/tables/user";


const skipEmailVerification = z.boolean().parse(config.get("flags.skipEmailVerification"));

class AuthHandlers {
  static ensureCorrectVerifyCode(
    user: User,
    verify_code_attempt: string
  ): void {
    if (skipEmailVerification) return;

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

  async handleLoginSuccess(request: Request, response: Response) {
    response.json({
      status: 200,
      message: "OK",
      user: {
        name: request.user?.preferred_name,
        loggedIn: !!request.user,
        role: request.user?.role,
      },
    });
  }

  async handleGetCurrentUser(
    request: Request,
    response: Response
  ) {
    response.json({
      status: 200,
      message: "OK",
      user: {
        name: request.user?.preferred_name,
        loggedIn: !!request.user,
        role: request.user?.role,
      },
    });
  }

  async handleSignUp(request: Request, response: Response) {
    throw new createHttpError.NotImplemented("Sign up handler not implemented");
  }

  static setPasswordPayloadSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    verify_code: z.string().length(6),
  });

  async handleSetPassword(request: Request, response: Response) {
    if (request.user) {
      throw new createHttpError.BadRequest("You are already logged in!");
    }

    const { email, password, verify_code } = AuthHandlers.setPasswordPayloadSchema.parse(request.body);

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

    AuthHandlers.ensureCorrectVerifyCode(found_user, verify_code);

    const password_salt = cryptoRandomBytes(16);
    found_user.hashed_password = await hashPasswordText(password, password_salt);
    found_user.password_salt = password_salt;

    await found_user.save();

    sendStandardResponse(response, 200);
  }
}

const handlersInstance = new AuthHandlers();
export default handlersInstance;
