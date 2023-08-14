import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import {
  ForeignKeyConstraintError as SequelizeForeignKeyConstraintError,
  ValidationError as SequelizeValidationError
} from "sequelize";

import { NullError, ValueError } from "@server/common/errors";
import Point from "@server/database/point";
import User from "@server/database/user";

const user_attributes = Point.getAttributes();
const allowed_create_fields = new Set(Object.keys(user_attributes));

allowed_create_fields.delete("createdAt");
allowed_create_fields.delete("updatedAt");


/**
 * Handles a GET request to /points.
 * For transparency, returns a list of points in the database with their values and redeemer's ID.
 *
 * @param request
 * @param response - `points` attribute contains array of points each with an `id`, `value` and `redeemer` (with redeemer's `id`) attribute
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

/**
 * Handles an authenticated admin POST request to /points to manually add points to the database.
 *
 * @param request
 * @param response - response attribute `data` contains the newly created point attributes (same types as initial request!)
 * @param next
 */
export async function createPoint(request: Request, response: Response, next: NextFunction): Promise<void> {
  // Point creation via QR code (for non-admins) is handled by a separate endpoint
  if (!response.locals.isAdminRequest) {
    return next();
  }

  const invalid_fields = Object.keys(request.body).filter((key) => !allowed_create_fields.has(key));
  if (invalid_fields.length > 0) {
    throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
  }

  if ("origin_qrcode_id" in request.body) {
    throw new createHttpError.UnprocessableEntity("You should not specify an origin QR (`origin_qrcode_id`) when manually adding points.");
  }

  let new_instance;
  try {
    new_instance = await Point.create(request.body);
  } catch (error) {
    if (error instanceof SequelizeValidationError) {
      throw new createHttpError.BadRequest(error.message);
    } else if (error instanceof SequelizeForeignKeyConstraintError) {
      if (error.fields instanceof Array) {
        throw new createHttpError.BadRequest(`Invalid foreign key(s) provided for field(s): ${error.fields.join(", ")}`);
      } else {
        throw new createHttpError.BadRequest(error.message);
      }
    }
    throw error;
  }

  response.status(200);
  response.json({ status: response.statusCode, message: "OK", data: new_instance });
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