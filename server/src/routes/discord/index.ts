import { Router as ExpressRouter } from "express"
import createHttpError from "http-errors"

import type { Request, Response } from "@server/types"
import { handleMethodNotAllowed } from "@server/common/middleware"

import { discordHandlers } from "./discord-handlers"

export const discordRouter = ExpressRouter()

discordRouter.use((request: Request, response: Response, next: () => void) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

discordRouter.route("/").get(discordHandlers.getDiscord()).all(handleMethodNotAllowed)

discordRouter.route("/redirect").get(discordHandlers.handleRedirect()).all(handleMethodNotAllowed)
