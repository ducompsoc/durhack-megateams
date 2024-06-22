import { NextFunction, Request, Response, Router as ExpressRouter } from "express"
import createHttpError from "http-errors"

import { handleMethodNotAllowed } from "@server/common/middleware"

import handlers from "./discord_handlers"

const discord_router = ExpressRouter()

discord_router.use((request: Request, _response: Response, next: NextFunction) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

discord_router.route("/").get(handlers.getDiscord).all(handleMethodNotAllowed)

discord_router.route("/redirect").get(handlers.handleRedirect).all(handleMethodNotAllowed)

export default discord_router
