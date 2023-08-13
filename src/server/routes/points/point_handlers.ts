import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@server/common/errors";
import Point from "@server/database/point";
import User from "@server/database/user";


/**
 * Handles a GET request to /points.
 * For transparency, returns a list of points in the database with their values and redeemer's ID.
 *
 * @param request
 * @param response
 */
export async function getPointsList(request: Request, response: Response): Promise<void> {
  const result = await Point.findAll({
    attributes: [["point_id", "id"], "value"],
    include: [
      { model: User, attributes: [["user_id", "id"]] },
    ]
  });
  response.status(200);
  response.json({
    status: 200,
    message: "OK",
    points: result,
  });
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