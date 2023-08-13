import { Router as ExpressRouter } from "express";

import * as handlers from "./area_handlers";
import { handleMethodForbidden } from "@server/common/middleware";


const areas_router = ExpressRouter();

areas_router.route("/")
  .get(handlers.getAreasList)
  .post(handlers.createArea)
  .all(handleMethodForbidden);

areas_router.route("/:area_id")
  .get(handlers.getAreaDetails)
  .patch(handlers.patchAreaDetails)
  .delete(handlers.deleteArea)
  .all(handleMethodForbidden);

export default areas_router;