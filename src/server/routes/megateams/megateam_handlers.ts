import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@/server/common/errors";
import Megateam from "@/server/database/megateam";


export async function getMegateamsList(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function createMegateam(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function getMegateamDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function patchMegateamDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function deleteMegateam(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}