import { App } from "@otterhttp/app"

import type { Request, Response } from "@server/types"
import { handleFailedAuthentication, methodNotAllowed, parseRouteId } from "@server/common/middleware"

import { pointsHandlers } from "./points-handlers";

export const pointsApp = new App<Request, Response>()

pointsApp
  .route("/")
  .all(methodNotAllowed(["GET", "POST"]))
  .get(pointsHandlers.getPointsList())
  .post(pointsHandlers.createPoint(), handleFailedAuthentication)

pointsApp
  .route("/:point_id")
  .all(methodNotAllowed(["GET", "PATCH", "DELETE"]))
  .all(parseRouteId("point_id"))
  .get(pointsHandlers.getPointDetails())
  .patch(pointsHandlers.patchPointDetails(), handleFailedAuthentication)
  .delete(pointsHandlers.deletePoint(), handleFailedAuthentication)
