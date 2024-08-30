import { Router as ExpressRouter } from "express"

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

import { pointsHandlers } from "./points-handlers";

const points_router = ExpressRouter()

points_router
  .route("/")
  .get(pointsHandlers.getPointsList())
  .post(pointsHandlers.createPoint(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

points_router
  .route("/:point_id")
  .all(parseRouteId("point_id"))
  .get(pointsHandlers.getPointDetails())
  .patch(pointsHandlers.patchPointDetails(), handleFailedAuthentication)
  .delete(pointsHandlers.deletePoint(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

export default points_router
