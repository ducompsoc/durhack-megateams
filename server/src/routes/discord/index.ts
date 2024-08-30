import { Router as ExpressRouter } from "express"
import createHttpError from "http-errors"

import type { Request, Response } from "@server/types"
import { handleMethodNotAllowed } from "@server/common/middleware"

import { discordHandlers } from "./discord_handlers"

const discord_router = ExpressRouter()

discord_router.use((request: Request, response: Response, next: () => void) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

discord_router.route("/").get(discordHandlers.getDiscord()).all(handleMethodNotAllowed)

discord_router.route("/redirect").get(discordHandlers.handleRedirect()).all(handleMethodNotAllowed)

export default discord_router
