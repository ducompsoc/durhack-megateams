import { App } from "@otterhttp/app"

import type { Request, Response } from "@server/types"
import { handleGetCsrfToken } from "@server/auth/csrf"
import { handleFailedAuthentication, methodNotAllowed } from "@server/common/middleware"

import { authHandlers } from "./auth-handlers"
import { keycloakApp } from "./keycloak";

export const authApp = new App<Request, Response>()

authApp.use("/keycloak", keycloakApp)

authApp.route("/csrf-token")
  .all(methodNotAllowed(["GET"]))
  .get(handleGetCsrfToken)

authApp
  .route("/socket-token")
  .all(methodNotAllowed(["GET"]))
  .get(authHandlers.handleGetSocketToken(), handleFailedAuthentication)

authApp.route("/logout")
  .all(methodNotAllowed(["POST"]))
  .post(authHandlers.handleLogout())
