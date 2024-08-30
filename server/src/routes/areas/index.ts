import { Router as ExpressRouter } from "express"

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

import { areaHandlers } from "./area_handlers"

const areas_router = ExpressRouter()

areas_router
  .route("/")
  .get(areaHandlers.getAreasList(), handleFailedAuthentication)
  .post(areaHandlers.createArea(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

areas_router
  .route("/:area_id")
  .all(parseRouteId("area_id"))
  .get(areaHandlers.getAreaDetails(), handleFailedAuthentication)
  .patch(areaHandlers.patchAreaDetails(), handleFailedAuthentication)
  .delete(areaHandlers.deleteArea(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

export default areas_router
