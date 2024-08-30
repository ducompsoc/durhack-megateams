import type { Request, Response } from "@server/types"
import { requireCondition } from "@server/common/decorators"

/**
 * Condition function that determines if the resource a user is trying to access/modify
 * is themselves.
 *
 * @param request -
 * @param response -
 */
export function userIsSelf(request: Request, response: Response): boolean {
  return !!request.user && request.user.id === response.locals.user_id
}

/**
 * Decorator that ensures a user is trying to access/modify themselves, not some other person.
 */
export const requireSelf = requireCondition(userIsSelf)
