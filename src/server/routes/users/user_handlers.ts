import createHttpError from "http-errors";
import { Request, Response } from "express";

import { isPositiveInteger } from "@server/common/validation";
import { NullError } from "@server/common/errors";
import User from "@server/database/user";


export async function getUsersList(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function createUser(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function getUserDetails(request: Request, response: Response): Promise<void> {
  const {user_id} = request.params;
  if (!isPositiveInteger(user_id)) throw new createHttpError.BadRequest("ID must be a number");

  throw new createHttpError.NotImplemented();
}

export async function patchUserDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function deleteUser(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}
