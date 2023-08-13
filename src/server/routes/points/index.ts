import { Router as ExpressRouter } from "express";

import { handleMethodForbidden } from "@server/common/middleware";

import * as handlers from "./point_handlers";



const points_router = ExpressRouter();

points_router.route("/")
  .get(handlers.getPointsList)
  .post(handlers.createPoint)
  .all(handleMethodForbidden);

points_router.route("/:point_id")
  .get(handlers.getPointDetails)
  .patch(handlers.patchPointDetails)
  .delete(handlers.deletePoint)
  .all(handleMethodForbidden);

export default points_router;