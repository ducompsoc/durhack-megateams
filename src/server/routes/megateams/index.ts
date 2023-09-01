import { Router as ExpressRouter } from "express";

import handlers from "./megateam_handlers";
import { handleMethodNotAllowed } from "@server/common/middleware";

const megateams_router = ExpressRouter();

megateams_router
  .route("/")
  .get(handlers.getMegateams)
  .all(handleMethodNotAllowed);

export default megateams_router;
