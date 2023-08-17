import { Router as ExpressRouter } from "express";

import {
  handleFailedAuthentication,
  handleMethodNotAllowed,
  parseRouteId
} from "@server/common/middleware";

import * as handlers from "./point_handlers";



const points_router = ExpressRouter();

points_router.route("/")
  .get(handlers.getPointsList)
  .post(handlers.createPoint, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

points_router.route("/:point_id")
  .all(parseRouteId("point_id"))
  .get(handlers.getPointDetails)
  .patch(handlers.patchPointDetails, handleFailedAuthentication)
  .delete(handlers.deletePoint, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

export default points_router;