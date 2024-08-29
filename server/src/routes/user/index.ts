import { NextFunction, Request, Response, Router as ExpressRouter } from "express"
import createHttpError from "http-errors"

import { handleMethodNotAllowed } from "@server/common/middleware"

import { userHandlers } from "./user_handlers"

const users_router = ExpressRouter()

users_router.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

users_router.route("/")
  .get(userHandlers.getUser())
  .patch(userHandlers.patchUserDetails())
  .all(handleMethodNotAllowed)

users_router
  .route("/team")
  .get(userHandlers.getTeam())
  .post(userHandlers.joinTeam())
  .delete(userHandlers.leaveTeam())
  .all(handleMethodNotAllowed)

export default users_router
