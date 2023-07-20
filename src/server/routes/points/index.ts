import { Router as ExpressRouter } from "express";

import * as handlers from "./point_handlers";
import { HandleMethodNotAllowed } from "@/server/common/middleware";


const points_router = ExpressRouter();

points_router.route("/")
  .get(handlers.getPointsList)
  .post(handlers.createPoint)
  .all(HandleMethodNotAllowed);

points_router.route("/:point_id")
  .get(handlers.getPointDetails)
  .patch(handlers.patchPointDetails)
  .delete(handlers.deletePoint)
  .all(HandleMethodNotAllowed);

export default points_router;