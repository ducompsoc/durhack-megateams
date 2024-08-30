import { Router as ExpressRouter } from "express"

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

import { pointsHandlers } from "./points-handlers";

export const pointsRouter = ExpressRouter()

pointsRouter
  .route("/")
  .get(pointsHandlers.getPointsList())
  .post(pointsHandlers.createPoint(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

pointsRouter
  .route("/:point_id")
  .all(parseRouteId("point_id"))
  .get(pointsHandlers.getPointDetails())
  .patch(pointsHandlers.patchPointDetails(), handleFailedAuthentication)
  .delete(pointsHandlers.deletePoint(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)
