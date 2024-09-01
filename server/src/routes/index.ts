import { App } from "@otterhttp/app"
import { ClientError } from "@otterhttp/errors"
import { json } from "@otterhttp/parsec"

import type { Request, Response } from "@server/types"
import { methodNotAllowed } from "@server/common/middleware"
import { doubleCsrfProtection } from "@server/auth/csrf"
import { csrfConfig } from "@server/config";

import { authApp } from "./auth"
import { areasApp } from "./areas"
import { megateamsApp } from "./megateams"
import { pointsApp } from "./points"
import { qrCodesApp } from "./qr-codes"
import { teamsApp } from "./teams"
import { usersApp } from "./users"
import { userApp } from "./user"
import { discordApp } from "./discord"

export const apiApp = new App<Request, Response>()

apiApp.use(json())

if (csrfConfig.enabled) {
  apiApp.use(doubleCsrfProtection)
}

function rootRequestHandler(request: Request, response: Response) {
  response.status(200)
  response.json({ status: response.statusCode, message: "OK", api_version: 1 })
}

function routeFallthroughHandler() {
  throw new ClientError("Unknown API route.", { statusCode: 404, expected: true })
}

apiApp.route("/")
  .all(methodNotAllowed(["GET"]))
  .get(rootRequestHandler)

apiApp.use("/auth", authApp)
apiApp.use("/areas", areasApp)
apiApp.use("/megateams", megateamsApp)
apiApp.use("/points", pointsApp)
apiApp.use("/qr_codes", qrCodesApp)
apiApp.use("/teams", teamsApp)
apiApp.use("/users", usersApp)
apiApp.use("/user", userApp)
apiApp.use("/discord", discordApp)

apiApp.use(routeFallthroughHandler)
