import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@server/common/errors";
import Point from "@server/database/point";


export async function getPointsList(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function createPoint(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function getPointDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function patchPointDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function deletePoint(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}