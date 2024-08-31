import { doubleCsrf } from "csrf-csrf"

import type { Request, Response } from "@server/types"
import { csrfConfig } from "@server/config"

function getSecret(request?: Request | undefined): string {
  return csrfConfig.secret
}

/*
  The default value for cookieName is "__Host-psifi.x-csrf-token".
  We remove the "__Host-" prefix from the cookie name (as in config/default.ts) as it produces this error on
  Chromium browsers:

     "This attempt to set a cookie via a Set-Cookie header was blocked because it used the "__Secure-" or " __Host-"
     prefix in its name and broke the additional rules applied to cookies with these prefixes as defined in
     https://datatracker.ietf.org/doc/html/draft-west-cookie-prefixes-05."

  These rules specify that the cookie MUST be:
      1.  Set with a "Secure" attribute
      2.  Set from a URI whose "scheme" is considered "secure" by the user
          agent.
      3.  Sent only to the host which set the cookie.  That is, a cookie
          named "__Host-cookie1" set from "https://example.com" MUST NOT
          contain a "Domain" attribute (and will therefore be sent only to
          "example.com", and not to "subdomain.example.com").
      4.  Sent to every request for a host.  That is, a cookie named
          "__Host-cookie1" MUST contain a "Path" attribute with a value of
          "/".
   Particularly, in development, the URI scheme is not considered "secure" by the user agent.
 */

export const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret,
  ...csrfConfig,
})

export function handleGetCsrfToken(request: Request, response: Response): void {
  const csrfToken = generateToken(request, response)
  response.status(200)
  response.json({ status: 200, message: "Token generation OK", token: csrfToken })
}
