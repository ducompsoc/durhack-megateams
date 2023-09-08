import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { requireCondition } from "@server/common/decorators";

export function useSelfId(request: Request, response: Response, next: NextFunction): void {
  if (!request.user) {
    throw new createHttpError.Unauthorized();
  }

  response.locals.user_id = request.user.id;
  next();
}

/**
 * Condition function that determines if the resource a user is trying to access/modify
 * is themselves.
 *
 * @param request
 * @param response
 * @private
 */
export function userIsSelf(request: Request, response: Response): boolean {
  return (!!request.user && request.user.id === response.locals.user_id);
}

/**
 * Decorator that ensures a user is trying to access/modify themselves, not some other person.
 */
export const requireSelf = requireCondition(userIsSelf);