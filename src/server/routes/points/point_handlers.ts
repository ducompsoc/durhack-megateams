import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import {
  ForeignKeyConstraintError as SequelizeForeignKeyConstraintError,
  ValidationError as SequelizeValidationError
} from "sequelize";

import { NullError, ValueError } from "@server/common/errors";
import Point from "@server/database/point";
import User from "@server/database/user";
import QRCode from "@server/database/qr_code";
import { buildQueryFromRequest, SequelizeQueryTransformFactory } from "@server/database";
import { strIsPositiveInteger } from "@server/common/validation";

const point_attributes = Point.getAttributes();

const allowed_create_fields = new Set(Object.keys(point_attributes));
["id", "createdAt", "updatedAt"].forEach((key) => allowed_create_fields.delete(key));

const patchable_fields = new Set(Object.keys(point_attributes));
["id", "createdAt", "updatedAt"].forEach((key) => patchable_fields.delete(key));


function dbErrorHandler(error: unknown) {
  if (error instanceof SequelizeValidationError) {
    throw new createHttpError.BadRequest(
      `${error.message} with fields: ${error.errors.map((e) => `* ${e.path} - ${e.message}`).join("; ")}`
    );
  } else if (error instanceof SequelizeForeignKeyConstraintError) {
    if (error.fields instanceof Array) {
      throw new createHttpError.BadRequest(`Invalid foreign key(s) provided for field(s): ${error.fields.join(", ")}`);
    } else {
      throw new createHttpError.BadRequest(error.message);
    }
  }
  throw error;
}

const point_transform_factories = new Map<string, SequelizeQueryTransformFactory<User>>();
point_transform_factories.set("redeemer_id", (value) => {
  if (strIsPositiveInteger(value)) return { condition: { redeemer_id: value } };
  throw new createHttpError.BadRequest("Malformed query parameter value for `redeemer_id`. Should be a positive integer.");
});


/**
 * Handles a GET request to /points.
 * For transparency, returns a list of points in the database with their values and redeemer's ID.
 * Can be additionally filtered by the redeemer's ID using a query parameter.
 *
 * @param request
 * @param response - `points` attribute contains array of points each with an `id`, `value` and `redeemer` (with redeemer's `id`) attribute
 */
export async function getPointsList(request: Request, response: Response): Promise<void> {
  const query = buildQueryFromRequest(request, point_transform_factories);
  query.attributes = [["point_id", "id"], "value"];
  query.include = [{ model: User, attributes: [["user_id", "id"]] }];
  const result = await Point.findAll(query);

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
 * @param request - fields required are `value` and `redeemer_id` (`origin_qrcode_id` should not be set for manual point creation)
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
    dbErrorHandler(error);
  }

  response.status(200);
  response.json({ status: response.statusCode, message: "OK", data: new_instance });
}

/**
 * Returns the details of a point entry in the database and linked QR code and user attributes.
 *
 * @param _request
 * @param response - data payload includes: `id`, `value`, `createdAt`, `qrcode` (can be null), and `redeemer`
 *   the latter two are their own objects with snapshots of QRCode and User attributes
 */
export async function getPointDetails(_request: Request, response: Response): Promise<void> {
  const { point_id } = response.locals;
  if (typeof point_id !== "number") throw new Error("Parsed `point_id` not found.");

  const result = await Point.findByPk(point_id, {
    attributes: {exclude: ["origin_qrcode_id", "redeemer_id", "updatedAt"]},
    include: [
      { model: QRCode, attributes: ["id", "name", "category", "start_time", "expiry_time"] },
      { model: User, attributes: ["id", "team_id", "preferred_name"] }],
    rejectOnEmpty: new NullError(),
  });

  const payload: any = result.toJSON();

  response.status(200);
  response.json({ "status": response.statusCode, "message": "OK", "data": payload });
}

/**
 * Handles an authenticated admin PATCH request to /points/:point_id to manually edit points to the database.
 *
 * @param request - includes fields to be edited (can be any of `value`, `origin_qrcode_id`, `redeemer_id`)
 * @param response - response attribute `data` contains the edited point's attributes (same types as initial request!)
 * @param next
 */
export async function patchPointDetails(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest) {
    return next();
  }

  const { point_id } = response.locals;
  if (typeof point_id !== "number") throw new Error("Parsed `point_id` not found.");

  const invalid_fields = Object.keys(request.body).filter((key) => !patchable_fields.has(key));
  if (invalid_fields.length > 0) {
    throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
  }

  const found_point = await Point.findByPk(point_id, {
    rejectOnEmpty: new NullError(),
  });

  try {
    await found_point.update(request.body);
  } catch (error) {
    dbErrorHandler(error);
  }

  response.status(200);
  response.json({ status: response.statusCode, message: "OK", data: found_point });
}

/**
 * Handles an authenticated admin DELETE request to /points/:point_id to drop/delete a point record from the db.
 *
 * @param _request
 * @param response - response attribute `data` contains the edited point's attributes (same types as initial request!)
 * @param next
 */
export async function deletePoint(_request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest) {
    return next();
  }

  const { point_id } = response.locals;
  if (typeof point_id !== "number") throw new Error("Parsed `point_id` not found.");

  const result = await Point.findByPk(point_id, {
    rejectOnEmpty: new NullError(),
  });

  await result.destroy();

  response.status(200);
  response.json({ status: response.statusCode, message: "OK" });
}
