import { Router as ExpressRouter } from "express";

import handlers from "./area_handlers";
import { handleMethodNotAllowed } from "@server/common/middleware";

const areas_router = ExpressRouter();

areas_router.route("/")
  .get(handlers.getAreas)
  .all(handleMethodNotAllowed);

export default areas_router;
