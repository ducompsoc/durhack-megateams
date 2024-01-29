import { NextFunction, Request, Response } from "express"

export default function rememberUserReferrerForRedirect(request: Request, _response: Response, next: NextFunction) {
  const referrer = request.query.referrer

  if (referrer) {
    request.session.redirect_to = referrer as string
  }

  next()
}
