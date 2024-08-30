import { Router as ExpressRouter } from "express"

import { handleMethodNotAllowed } from "@server/common/middleware"

import { megateamsHandlers } from "./megateam-handlers"

export const megateamsRouter = ExpressRouter()

megateamsRouter.route("/")
  .get(megateamsHandlers.getMegateamsList())
  .post(megateamsHandlers.createMegateam())
  .all(handleMethodNotAllowed)

megateamsRouter.route("/:megateam_id")
  .get(megateamsHandlers.getMegateamDetails())
  .patch(megateamsHandlers.patchMegateamDetails())
  .delete(megateamsHandlers.deleteMegateam())
  .all(handleMethodNotAllowed)
