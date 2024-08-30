import type { Request, Response } from "@server/types"

export function rememberUserReferrerForRedirect(request: Request, _response: Response, next: () => void) {
  const referrer = request.query.referrer

  if (referrer) {
    request.session.redirect_to = referrer as string
  }

  next()
}
