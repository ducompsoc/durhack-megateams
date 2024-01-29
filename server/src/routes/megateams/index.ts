import { Router as ExpressRouter } from "express"

import handlers from "./megateam_handlers"
import { handleMethodNotAllowed } from "@server/common/middleware"

const megateams_router = ExpressRouter()

megateams_router.route("/").get(handlers.getMegateamsList).post(handlers.createMegateam).all(handleMethodNotAllowed)

megateams_router
  .route("/:megateam_id")
  .get(handlers.getMegateamDetails)
  .patch(handlers.patchMegateamDetails)
  .delete(handlers.deleteMegateam)

export default megateams_router
