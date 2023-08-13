import { Router as ExpressRouter } from "express";

import * as handlers from "./megateam_handlers";
import { handleMethodForbidden } from "@server/common/middleware";


const megateams_router = ExpressRouter();

megateams_router.route("/")
  .get(handlers.getMegateamsList)
  .post(handlers.createMegateam)
  .all(handleMethodForbidden);

megateams_router.route("/:megateam_id")
  .get(handlers.getMegateamDetails)
  .patch(handlers.patchMegateamDetails)
  .delete(handlers.deleteMegateam)
  .all(handleMethodForbidden);

export default megateams_router;