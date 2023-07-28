import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@server/common/errors";
import Team from "@server/database/team";


export async function getTeamsList(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function createTeam(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function getTeamDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function patchTeamDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function deleteTeam(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}