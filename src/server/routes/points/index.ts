import { Router as ExpressRouter } from "express";

import { handleMethodNotAllowed } from "@server/common/middleware";

import * as handlers from "./point_handlers";



const points_router = ExpressRouter();

points_router.route("/")
  .get(handlers.getPointsList)
  .post(handlers.createPoint)
  .all(handleMethodNotAllowed);

points_router.route("/:point_id")
  .get(handlers.getPointDetails)
  .patch(handlers.patchPointDetails)
  .delete(handlers.deletePoint)
  .all(handleMethodNotAllowed);

export default points_router;