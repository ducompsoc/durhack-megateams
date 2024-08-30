import { Router as ExpressRouter } from "express"

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

import { usersHandlers } from "./users-handlers"

export const usersRouter = ExpressRouter()

usersRouter
  .route("/")
  .get(usersHandlers.getUsersListAsAdmin(), usersHandlers.getUsersListDefault())
  .all(handleMethodNotAllowed)

usersRouter
  .route("/:user_id")
  .get(usersHandlers.getUserDetailsAsAdmin(), usersHandlers.getUserDetailsDefault())
  .patch(usersHandlers.patchUserDetailsAsAdmin(), usersHandlers.patchMyUserDetails(), handleFailedAuthentication)
  .delete(usersHandlers.deleteUserAsAdmin(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)
