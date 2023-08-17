import createHttpError from "http-errors";
import {NextFunction, Request, Response} from "express";
import { literal as SequelizeLiteral, Op, ValidationError as SequelizeValidationError } from "sequelize";

import { NullError, ValueError } from "@server/common/errors";
import { UserRole } from "@server/common/model_enums";
import { buildQueryFromRequest, SequelizeQueryTransformFactory } from "@server/database";
import User from "@server/database/user";
import Team from "@server/database/team";
import Point from "@server/database/point";
import { structuredClone } from "next/dist/compiled/@edge-runtime/primitives";
import Megateam from "@server/database/megateam";
import Area from "@server/database/area";


const user_transform_factories = new Map<string, SequelizeQueryTransformFactory<User>>();
user_transform_factories.set("email", (value: string) => ({
  condition: {email: { [Op.like]: SequelizeLiteral("concat('%', :email, '%')") }},
  replacements: new Map([["email", value]]),
  orders: [
    ["email", "ASC"],
  ]
}));

user_transform_factories.set("checked_in", (checked_in: string) => {
  if (checked_in === "true") return { condition: { checked_in: true }};
  if (checked_in === "false") return { condition: { checked_in: false }};
  throw new createHttpError.BadRequest("Malformed query parameter value for 'checked_in'");
});

const user_attributes = User.getAttributes();
const allowed_create_fields = new Set(Object.keys(user_attributes));

allowed_create_fields.delete("createdAt");
allowed_create_fields.delete("updatedAt");

const admin_patch_fields = new Set(Object.keys(user_attributes));
[
  "id", "hashed_password", "password_salt", "verify_code", "verify_sent_at",
  "initially_logged_in_at", "last_logged_in_at", "createdAt", "updatedAt",
].forEach((element) => admin_patch_fields.delete(element));
const self_patch_fields = structuredClone(admin_patch_fields);
[
  "email", "role", "checkedIn", "team_id",
].forEach((element) => self_patch_fields.delete(element));

/**
 * Route middleware that adds a flag to `response.locals` reflecting whether
 * the request is targeting the 'self' user.
 *
 * @param request
 * @param response
 * @param next
 */
export function setSelfRequestFlag(request: Request, response: Response, next: NextFunction) {
  response.locals.isSelfRequest = request.user?.id === response.locals.user_id;
  next();
}

/**
 * Handles an unauthenticated or non-admin GET request to /users.
 * Returns a list of user IDs and preferred names that cannot be filtered.
 *
 * @param request
 * @param response
 */
export async function getUsersListDefault(request: Request, response: Response): Promise<void> {
  const result = await User.findAll({
    attributes: [["user_id", "id"], "preferred_name"]
  });
  response.status(200);
  response.json({
    status: 200,
    message: "OK",
    users: result,
  });
}

/**
 * Handles an authenticated admin GET request to /users.
 * Returns a list of user IDs and preferred names that can be filtered by:
 *   checked_in.
 * and searched by
 *   email.
 * using URL search parameters.
 *
 * @param request
 * @param response
 * @param next
 */
export async function getUsersListAsAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest) {
    return next();
  }

  const query = buildQueryFromRequest(request, user_transform_factories);
  query.attributes = [["user_id", "id"], "preferred_name", "full_name", "email"];
  query.include = [Point, Team, Area, Megateam];
  const result = await User.findAll(query);

  const payload = result.map((user: User) => ({
    id: user.id,
    preferred_name: user.preferred_name,
    full_name: user.full_name,
    email: user.email,
    points: Point.getPointsTotal(user.points || []),
    team_name: user.team?.name,
    megateam_name: user.team?.area?.megateam?.name,
  }));

  response.status(200);
  response.json({
    status: 200,
    message: "OK",
    users: payload,
  });
}

/**
 * Handles an authenticated admin POST request to /users.
 * Creates an entirely new user. This should only be used in the case that someone completely failed
 * to fill in the signup form, and somehow turned up at DurHack nonetheless.
 *
 * Required fields:
 *   ...
 *
 * @param request
 * @param response
 * @param next
 */
export async function createUserAsAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest) {
    return next();
  }

  const invalid_fields = Object.keys(request.body).filter((key) => !allowed_create_fields.has(key));
  if (invalid_fields.length > 0) {
    throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
  }

  let new_instance;
  try {
    new_instance = await User.create(request.body);
  } catch (error) {
    if (error instanceof SequelizeValidationError) {
      throw new createHttpError.BadRequest(error.message);
    }
    throw error;
  }

  response.status(200);
  response.json({ status: response.statusCode, message: "OK", data: new_instance });
}

/**
 * Handles an unauthenticated or non-admin GET request to /users/:id.
 * Returns the user's basic details including team affiliation, points, etc.
 *
 * @param request
 * @param response
 */
export async function getUserDetailsDefault(request: Request, response: Response): Promise<void> {
  const { user_id } = response.locals;
  if (typeof user_id !== "number") throw new Error("Parsed `user_id` not found.");

  const result = await User.findByPk(user_id, {
    attributes: ["id", "preferred_name"],
    include: [Team, Point],
    rejectOnEmpty: new NullError(),
  });

  const payload: any = result.toJSON();
  payload.points = Point.getPointsTotal(payload.points);

  response.status(200);
  response.json({ "status": response.statusCode, "message": "OK", "data": payload });
}

async function doGetAllUserDetails(request: Request, response: Response): Promise<void> {
  const { user_id } = response.locals;
  if (typeof user_id !== "number") throw new Error("Parsed `user_id` not found.");

  const result = await User.findByPk(user_id, {
    attributes: {exclude: ["hashed_password", "password_salt", "verify_code", "verify_sent_at"]},
    include: [Team, Point],
    rejectOnEmpty: new NullError(),
  });

  const payload: any = result.toJSON();
  payload.points = Point.getPointsTotal(payload.points);

  response.status(200);
  response.json({ "status": response.statusCode, "message": "OK", "data": payload });
}

/**
 * Handles an authenticated admin GET request to /users/:id.
 * Returns all the user's details, including Hackathons UK fields.
 *
 * @param request
 * @param response
 * @param next
 */
export async function getUserDetailsAsAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest) {
    return next();
  }

  await doGetAllUserDetails(request, response);
}

/**
 * Handles an authenticated self GET request to /users/:id.
 * Returns all the user's details, including Hackathons UK fields.
 *
 * @param request
 * @param response
 * @param next
 */
export async function getMyUserDetails(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isSelfRequest) {
    return next();
  }

  await doGetAllUserDetails(request, response);
}

function getPatchHandler(allowed_fields_set: Set<string>) {
  return async function(request: Request, response: Response): Promise<void> {
    const { user_id } = response.locals;
    if (typeof user_id !== "number") throw new Error("Parsed `user_id` not found.");

    const invalid_fields = Object.keys(request.body).filter((key) => !allowed_fields_set.has(key));
    if (invalid_fields.length > 0) {
      throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
    }

    const found_user = await User.findByPk(user_id, {
      rejectOnEmpty: new NullError(),
    });

    try {
      await found_user.update(request.body);
    } catch (error) {
      if (error instanceof SequelizeValidationError) {
        throw new createHttpError.BadRequest(error.message);
      }
      throw error;
    }

    response.status(200);
    response.json({ status: response.statusCode, message: "OK", data: found_user });
  };
}

const doPatchAdmin = getPatchHandler(admin_patch_fields);
const doPatchSelf = getPatchHandler(self_patch_fields);


/**
 * Handles an authenticated admin POST request to /users/:id.
 * Allows editing of all fields excluding password.
 *
 * @param request
 * @param response
 * @param next
 */
export async function patchUserDetailsAsAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest) {
    return next();
  }

  await doPatchAdmin(request, response);
}

/**
 * Handles an authenticated hacker self POST request to /users/:id.
 * Allows editing of all MLH fields, email, etc.
 *
 * @param request
 * @param response
 * @param next
 */
export async function patchMyUserDetails(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isSelfRequest) {
    return next();
  }

  await doPatchSelf(request, response);
}

/**
 * Handles an authenticated admin DELETE request to /users/:id.
 * Deletes the resource.
 *
 * @param request
 * @param response
 * @param next
 */
export async function deleteUserAsAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest) {
    return next();
  }

  const { user_id } = response.locals;
  if (typeof user_id !== "number") throw new Error("Parsed `user_id` not found.");

  const result = await User.findByPk(user_id, {
    attributes: ["id"],
    rejectOnEmpty: new NullError(),
  });

  await result.destroy();

  response.status(200);
  response.json({ status: response.statusCode, message: "OK" });
}
