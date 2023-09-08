import {NextFunction, Request, Response} from "express";
import {UserRole} from "@server/common/model_enums";

type ICondition = (request: Request, response: Response) => boolean;

/**
 * Returns a decorator that can be applied to an Express request handler class method.
 * The decorated method will call the provided condition function with Express request
 * and response objects.
 * If the condition returns `false`, then the handler will be skipped.
 * If the condition returns `true`, the handler will consider the request as usual.
 *
 * @param condition
 */
export function requireCondition(condition: ICondition) {
  return function (target: any, property_key: string, descriptor: PropertyDescriptor) {
    const old_function = descriptor.value;

    async function wrapped_function (request: Request, response: Response, next: NextFunction) {
      if (!condition(request, response)) {
        return next();
      }
      return await old_function.apply(target, [request, response, next]);
    }

    descriptor.value = wrapped_function;
  };
}

export function userIsRole(role: UserRole) {
  return function(request: Request) {
    return request.user?.role === role;
  };
}

export function userIsLoggedIn(request: Request) {
  return !!request.user;
}

/**
 * Decorator that ensures `request.user.role` is `UserRole.admin`.
 */
export const requireUserIsAdmin = requireCondition(userIsRole(UserRole.admin));

/**
 * Decorator that ensures `request.user.role` is `UserRole.volunteer`.
 */
export const requireUserIsVolunteer = requireCondition(userIsRole(UserRole.volunteer));

/**
 * Decorator that ensures `request.user.role` is `UserRole.sponsor`.
 */
export const requireUserIsSponsor = requireCondition(userIsRole(UserRole.sponsor));

/**
 * Decorator that ensures `request.user` is not null/undefined.
 */
export const requireLoggedIn = requireCondition(userIsLoggedIn);

/**
 * Decorator that ensures `request.user.role` is one of the provided roles.
 */
export function requireUserIsOneOf(...roles: UserRole[]) {
  return requireCondition(function (request: Request): boolean {
    return !!request.user && roles.includes(request.user.role);
  });
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