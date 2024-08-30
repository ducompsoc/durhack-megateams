import { Router as ExpressRouter } from "express"
import createHttpError from "http-errors"

import type { Request, Response } from "@server/types"
import { handleMethodNotAllowed } from "@server/common/middleware"

import { userHandlers } from "./user-handlers"

const userRouter = ExpressRouter()

userRouter.use((request: Request, response: Response, next: () => void) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

userRouter.route("/")
  .get(userHandlers.getUser())
  .patch(userHandlers.patchUserDetails())
  .all(handleMethodNotAllowed)

userRouter
  .route("/team")
  .get(userHandlers.getTeam())
  .post(userHandlers.joinTeam())
  .delete(userHandlers.leaveTeam())
  .all(handleMethodNotAllowed)

export default userRouter
