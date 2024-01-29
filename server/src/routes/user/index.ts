import { NextFunction, Request, Response, Router as ExpressRouter } from "express"
import createHttpError from "http-errors"

import { handleMethodNotAllowed } from "@server/common/middleware"

import handlers from "./user_handlers"

const users_router = ExpressRouter()

users_router.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

users_router.route("/").get(handlers.getUser).patch(handlers.patchUserDetails).all(handleMethodNotAllowed)

users_router
  .route("/team")
  .get(handlers.getTeam)
  .post(handlers.joinTeam)
  .delete(handlers.leaveTeam)
  .all(handleMethodNotAllowed)

export default users_router
