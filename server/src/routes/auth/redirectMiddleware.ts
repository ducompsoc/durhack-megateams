import { NextFunction, Request, Response } from "express";

export default function redirectMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const redirect_to = request.query.redirect_to;

  if (redirect_to && typeof redirect_to === "string") {
    request.session.redirect_to = redirect_to as string;
  }

  next();
}
