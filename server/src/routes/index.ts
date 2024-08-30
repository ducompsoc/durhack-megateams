import { Router as ExpressRouter } from "express"
import bodyParser from "body-parser"
import methodOverride from "method-override"
import createHttpError from "http-errors"
import cookieParser from "cookie-parser"

import type { Request, Response } from "@server/types"
import { handleMethodNotAllowed } from "@server/common/middleware"
import { doubleCsrfProtection } from "@server/auth/csrf"
import { cookieParserConfig, csrfConfig } from "@server/config";

import { authRouter } from "./auth"
import { areasRouter } from "./areas"
import { megateamsRouter } from "./megateams"
import { pointsRouter } from "./points"
import { qrCodesRouter } from "./qr-codes"
import { teamsRouter } from "./teams"
import { usersRouter } from "./users"
import { userRouter } from "./user"
import { discordRouter } from "./discord"
import { apiErrorHandler } from "./error-handling"

export const apiRouter = ExpressRouter()

apiRouter.use(cookieParser(cookieParserConfig.secret))
apiRouter.use(bodyParser.json())
apiRouter.use(bodyParser.urlencoded({ extended: true }))

if (csrfConfig.enabled) {
  apiRouter.use(doubleCsrfProtection)
}

function rootRequestHandler(request: Request, response: Response) {
  response.status(200)
  response.json({ status: response.statusCode, message: "OK", api_version: 1 })
}

function routeFallthroughHandler() {
  throw new createHttpError.NotFound("Unknown API route.")
}

apiRouter.route("/").get(rootRequestHandler).all(handleMethodNotAllowed)

apiRouter.use("/auth", authRouter)
apiRouter.use("/areas", areasRouter)
apiRouter.use("/megateams", megateamsRouter)
apiRouter.use("/points", pointsRouter)
apiRouter.use("/qr_codes", qrCodesRouter)
apiRouter.use("/teams", teamsRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/user", userRouter)
apiRouter.use("/discord", discordRouter)

apiRouter.use(routeFallthroughHandler)

apiRouter.use(methodOverride())
apiRouter.use(apiErrorHandler)
