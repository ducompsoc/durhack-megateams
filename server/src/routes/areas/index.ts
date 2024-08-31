import { Router as ExpressRouter } from "express"

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

import { areaHandlers } from "./area-handlers"

export const areasRouter = ExpressRouter()

areasRouter
  .route("/")
  .get(areaHandlers.getAreasList(), handleFailedAuthentication)
  .post(areaHandlers.createArea(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

areasRouter
  .route("/:area_id")
  .all(parseRouteId("area_id"))
  .get(areaHandlers.getAreaDetails(), handleFailedAuthentication)
  .patch(areaHandlers.patchAreaDetails(), handleFailedAuthentication)
  .delete(areaHandlers.deleteArea(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)
