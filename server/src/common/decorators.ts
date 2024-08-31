import { UserRole } from "@server/common/model-enums"
import type { Middleware, Request, Response } from "@server/types"

type Condition = (request: Request, response: Response) => boolean | Promise<boolean>

/**
 * Factory that creates a TypeScript decorator for a condition.
 * Decorated methods are expected to return a middleware function;
 * the decorated function will return the same middleware that will execute
 * only if the condition evaluates true. If the condition evaluates false, the
 * middleware will invoke next() and terminate.
 *
 * @param condition
 */
export function requireCondition(condition: Condition) {
  return (
    value: (this: unknown, ...rest: unknown[]) => Middleware,
    _: {
      kind: "method"
    },
  ) => {
    return function wrapped_function(this: unknown, ...args: unknown[]): Middleware {
      const middleware: Middleware = value.call(this, ...args)

      return async (request: Request, response: Response, next: () => void): Promise<void> => {
        const evaluatedCondition = await condition(request, response)
        if (!evaluatedCondition) {
          next()
          return
        }
        await middleware.call(value, request, response, next)
      }
    }
  }
}

export function userHasRole(role: UserRole): Condition {
  // todo: use keycloak token set for this
  return (request: Request) => false
}

export function userIsLoggedIn(): Condition {
  return (request: Request) => request.user != null
}

/**
 * Decorator that ensures `request.user.role` is `UserRole.admin`.
 */
export function requireUserIsAdmin() {
  return requireCondition(userHasRole(UserRole.admin))
}

/**
 * Decorator that ensures `request.user.role` is `UserRole.volunteer`.
 */
export function requireUserIsVolunteer() {
  return requireCondition(userHasRole(UserRole.volunteer))
}

/**
 * Decorator that ensures `request.user.role` is `UserRole.sponsor`.
 */
export function requireUserIsSponsor() {
  return requireCondition(userHasRole(UserRole.sponsor))
}

/**
 * Decorator that ensures `request.user` is not null/undefined.
 */
export function requireLoggedIn() {
  return requireCondition(userIsLoggedIn())
}

/**
 * Decorator that ensures `request.user.role` is one of the provided roles.
 */
export function requireUserIsOneOf(...roles: UserRole[]) {
  // todo: use keycloak token set for this
  return requireCondition((request: Request): boolean => false)
}

/**
 * Condition function that determines if the resource a user is trying to access/modify
 * is themselves.
 */
export function userIsSelf(): Condition {
  return (request: Request, response: Response): boolean => {
    return request.user != null && request.user.keycloakUserId === response.locals.user_id
  }
}

/**
 * Decorator that ensures a user is trying to access/modify themselves, not some other person.
 */
export function requireSelf() {
  return requireCondition(userIsSelf())
}
