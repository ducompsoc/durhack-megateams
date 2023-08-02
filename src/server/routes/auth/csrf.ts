import { Request, Response } from "express";
import { doubleCsrf } from "csrf-csrf";


function rollingSecret(request?: Request): string {
  return "this_secret_does_not_roll";
}

export const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: rollingSecret,

  // Not setting the cookie name as below produces this error on Chromium browsers:
  // "This attempt to set a cookie via a Set-Cookie header was blocked because it used the "__Secure-" or " __Host-"
  // prefix in its name and broke the additional rules applied to cookies with these prefixes as defined in
  // https://datatracker.ietf.org/doc/html/draft-west-cookie-prefixes-05".
  // These rules specify that the cookie MUST be:
  //    1.  Set with a "Secure" attribute
  //    2.  Set from a URI whose "scheme" is considered "secure" by the user
  //        agent.
  //    3.  Sent only to the host which set the cookie.  That is, a cookie
  //        named "__Host-cookie1" set from "https://example.com" MUST NOT
  //        contain a "Domain" attribute (and will therefore be sent only to
  //        "example.com", and not to "subdomain.example.com").
  //    4.  Sent to every request for a host.  That is, a cookie named
  //        "__Host-cookie1" MUST contain a "Path" attribute with a value of
  //        "/".
  // Particularly, in development, the URI scheme is not considered "secure" by the user agent.
  cookieName: "psifi.x-csrf-token", // defaults to "__Host-psifi.x-csrf-token

  cookieOptions: {
    sameSite: "strict",
    path: "/",
    secure: true,
  },
});

export function handleGetCsrfToken(request: Request, response: Response): void {
  const csrfToken = generateToken(response, request);
  response.status(200);
  response.json({ "status": 200, "message": "OK", "token": csrfToken });
}
