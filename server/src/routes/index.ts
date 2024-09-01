import { App } from "@otterhttp/app"
import { ClientError } from "@otterhttp/errors"
import { json } from "@otterhttp/parsec"

import { doubleCsrfProtection } from "@server/auth/csrf"
import { methodNotAllowed } from "@server/common/middleware"
import { csrfConfig } from "@server/config"
import type { Request, Response } from "@server/types"
import { prisma } from "@server/database";

import { areasApp } from "./areas"
import { authApp } from "./auth"
import { discordApp } from "./discord"
import { megateamsApp } from "./megateams"
import { pointsApp } from "./points"
import { qrCodesApp } from "./qr-codes"
import { teamsApp } from "./teams"
import { userApp } from "./user"
import { usersApp } from "./users"
import { getSession } from "@server/auth/session";
import { adaptTokenSetToClient } from "@server/auth/adapt-token-set";
import { keycloakClient } from "@server/routes/auth/keycloak/keycloak-client";

export const apiApp = new App<Request, Response>()

apiApp.use(json())
apiApp.use(async (request, response, next) => {
  const session = await getSession(request, response)
  if (session.userId == null) return next()
  const user = await prisma.user.findUnique({
    where: { keycloakUserId: session.userId },
    include: { tokenSet: true },
  })

  if (user == null || user.tokenSet == null) {
    session.userId = undefined
    await session.commit()
    return next()
  }

  let tokenSet = adaptTokenSetToClient(user.tokenSet)
  if (tokenSet.expired()) {

  }

  request.userTokenSet = tokenSet

  request.user = user
  next()
})

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

apiApp
  .route("/")
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
