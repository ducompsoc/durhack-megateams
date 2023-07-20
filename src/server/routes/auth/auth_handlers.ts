import { Request, Response } from "express";
import createHttpError from "http-errors";
import { randomBytes as cryptoRandomBytes } from "crypto";

import { validateEmail } from "@server/common/validation";
import { ValueError } from "@server/common/errors";

import { validatePassword, hashPasswordText } from "./auth_util";


export async function handleSignUp(request: Request, response: Response) {
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

  if (typeof email !== "string" || !await validateEmail(email)) {
    throw new createHttpError.BadRequest("Email address needs to be mailable.");
  }

  if (typeof password !== "string" || !validatePassword(password)) {
    throw new createHttpError.BadRequest("Password should be a string containing no illegal characters.");
  }

  const password_salt = cryptoRandomBytes(16);
  const hashed_password = await hashPasswordText(password, password_salt);

  const payload = { full_name, preferred_name, email, password_salt, hashed_password };

  throw new createHttpError.NotImplemented();

  try {

  } catch (error) {
    if (error instanceof ValueError) throw new createHttpError.BadRequest("Invalid values provided.");
    throw error;
  }
}