import createHttpError from "http-errors"
import { Request, Response, NextFunction } from "express"
import { z } from "zod"

import { NullError } from "@server/common/errors"
import Point from "@server/database/tables/point"
import User from "@server/database/tables/user"
import QRCode from "@server/database/tables/qr_code"
import { buildQueryFromRequest, SequelizeQueryTransformFactory } from "@server/database"
import { requireUserIsAdmin } from "@server/common/decorators"

const create_point_payload_schema = z.object({
  value: z.number().positive(),
  origin_qrcode_id: z.number().positive().optional(),
  redeemer_id: z.number().positive(),
})

const patch_point_payload_schema = z
  .object({
    value: z.number().positive().optional(),
    origin_qrcode_id: z.number().positive().optional(),
    redeemer_id: z.number().positive().optional(),
  })
  .strict()

const point_transform_factories = new Map<string, SequelizeQueryTransformFactory<User>>()
point_transform_factories.set("redeemer_id", value => {
  const parsed_value = z.coerce.number().positive().parse(value)
  return { condition: { redeemer_id: parsed_value } }
})

class PointHandlers {
  /**
   * Handles a GET request to /points.
   * For transparency, returns a list of points in the database with their values and redeemer's ID.
   * Can be additionally filtered by the redeemer's ID using a query parameter.
   *
   * @param request - query parameters can include `redeemer_id` (positive integer)
   * @param response - `points` attribute contains array of points each with an `id`, `value` and `redeemer` (with redeemer's `id`) attribute
   */
  async getPointsList(this: void, request: Request, response: Response): Promise<void> {
    const query = buildQueryFromRequest(request, point_transform_factories)
    query.attributes = [["point_id", "id"], "value"]
    query.include = [{ model: User, attributes: [["user_id", "id"]] }]
    const result = await Point.findAll(query)

    response.status(200)
    response.json({
      status: 200,
      message: "OK",
      points: result,
    })
  }

  /**
   * Handles an authenticated admin POST request to /points to manually add points to the database.
   *
   * @param request - attributes required are `value` and `redeemer_id` (`origin_qrcode_id` should not be set for manual point creation)
   * @param response - response attribute `data` contains the newly created point attributes (same types as initial request!)
   * @param _next - next function to handleFailedAuthentication should user fail requireUserIsAdmin requirement
   */
  @requireUserIsAdmin // Point creation via QR code (for non-admins) is handled by a separate endpoint
  async createPoint(this: void, request: Request, response: Response, _next: NextFunction): Promise<void> {
    const parsed_payload = create_point_payload_schema.parse(request.body)

    if (parsed_payload.origin_qrcode_id) {
      throw new createHttpError.UnprocessableEntity(
        "You should not specify an origin QR (`origin_qrcode_id`) when manually adding points.",
      )
    }

    const new_instance = await Point.create(request.body) // database/sequelize errors thrown to error_handling.ts

    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: new_instance })
  }

  /**
   * Returns the details of a point entry in the database and linked QR code and user attributes.
   *
   * @param _request
   * @param response - data payload includes: `id`, `value`, `createdAt`, `qrcode` (can be null), and `redeemer`
   *   the latter two are their own objects with snapshots of QRCode and User attributes
   */
  async getPointDetails(_request: Request, response: Response): Promise<void> {
    const { point_id } = response.locals
    if (typeof point_id !== "number") throw new Error("Parsed `point_id` not found.")

    const result = await Point.findByPk(point_id, {
      attributes: { exclude: ["origin_qrcode_id", "redeemer_id", "updatedAt"] },
      include: [
        { model: QRCode, attributes: ["id", "name", "category", "start_time", "expiry_time"] },
        { model: User, attributes: ["id", "team_id", "preferred_name"] },
      ],
      rejectOnEmpty: new NullError(),
    })

    const payload: any = result.toJSON()

    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }

  /**
   * Handles an authenticated admin PATCH request to /points/:point_id to manually edit points to the database.
   *
   * @param request - includes fields to be edited (can be any of `value`, `origin_qrcode_id`, `redeemer_id`)
   * @param response - response attribute `data` contains the edited point's attributes (same types as initial request!)
   * @param _next - next function to handleFailedAuthentication should user fail requireUserIsAdmin requirement
   */
  @requireUserIsAdmin
  async patchPointDetails(this: void, request: Request, response: Response, _next: NextFunction): Promise<void> {
    const { point_id } = response.locals
    if (typeof point_id !== "number") throw new Error("Parsed `point_id` not found.")

    const parsed_payload = patch_point_payload_schema.parse(request.body)

    const found_point = await Point.findByPk(point_id, {
      rejectOnEmpty: new NullError(),
    })
    await found_point.update(parsed_payload) // database/sequelize errors thrown to error_handling.ts

    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: found_point })
  }

  /**
   * Handles an authenticated admin DELETE request to /points/:point_id to drop/delete a point record from the db.
   *
   * @param _request
   * @param response - response attribute `data` contains the edited point's attributes (same types as initial request!)
   * @param _next - next function to handleFailedAuthentication should user fail requireUserIsAdmin requirement
   */
  @requireUserIsAdmin
  async deletePoint(this: void, _request: Request, response: Response, _next: NextFunction): Promise<void> {
    const { point_id } = response.locals
    if (typeof point_id !== "number") throw new Error("Parsed `point_id` not found.")

    const result = await Point.findByPk(point_id, {
      rejectOnEmpty: new NullError(),
    })

    await result.destroy()

    response.status(200)
    response.json({ status: response.statusCode, message: "OK" })
  }
}

const PointHandlersInstance = new PointHandlers()
export default PointHandlersInstance
