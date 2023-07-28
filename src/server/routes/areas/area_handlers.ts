import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@server/common/errors";
import Area from "@server/database/area";


export async function getAreasList(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function createArea(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function getAreaDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function patchAreaDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function deleteArea(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}