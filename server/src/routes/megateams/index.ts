import { Router as ExpressRouter } from "express"

import { handleMethodNotAllowed } from "@server/common/middleware"

import { megateamsHandlers } from "./megateam-handlers"

const megateams_router = ExpressRouter()

megateams_router.route("/")
  .get(megateamsHandlers.getMegateamsList())
  .post(megateamsHandlers.createMegateam())
  .all(handleMethodNotAllowed)

megateams_router.route("/:megateam_id")
  .get(megateamsHandlers.getMegateamDetails())
  .patch(megateamsHandlers.patchMegateamDetails())
  .delete(megateamsHandlers.deleteMegateam())
  .all(handleMethodNotAllowed)

export default megateams_router
