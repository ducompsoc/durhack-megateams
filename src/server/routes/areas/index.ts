import { Router as ExpressRouter } from "express";

import handlers from "./area_handlers";
import {handleMethodNotAllowed, parseRouteId} from "@server/common/middleware";

const areas_router = ExpressRouter();

areas_router.route("/")
  .get(handlers.getAreasList)
  .post(handlers.createArea)
  .all(handleMethodNotAllowed);

areas_router.route("/:area_id")
  .all(parseRouteId("area_id"))
  .get(handlers.getAreaDetails)
  .patch(handlers.patchAreaDetails)
  .delete(handlers.deleteArea);

export default areas_router;
