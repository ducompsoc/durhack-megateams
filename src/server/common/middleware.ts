import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { ValueError } from "@server/common/errors";
import { UserRole } from "@server/common/model_enums";

export function setAdminRequestFlag(request: Request, response: Response, next: NextFunction) {
  response.locals.isAdminRequest = request.user?.role === UserRole.admin;
  next();
}

export function handleMethodNotAllowed() {
  throw new createHttpError.MethodNotAllowed();
}

export function handleNotImplemented() {
  throw new createHttpError.NotImplemented();
}

export function handleFailedAuthentication(request: Request) {
  if (request.user) {
    throw new createHttpError.Forbidden();
  }
  throw new createHttpError.Unauthorized();
}

export function mutateRequestValue<T>(getter: (request: Request) => unknown, mutator: (value: unknown) => T, setter: (response: Response, value: T) => void) {
  return function (request: Request, response: Response, next: NextFunction) {
    const valueToMutate = getter(request);
    const mutatedValue = mutator(valueToMutate);
    setter(response, mutatedValue);
    next();
  };
}

function getRouteParameter(key: string) {
  return function (request: Request): unknown {
    return request.params[key];
  };
}

function getQueryParameter(key: string) {
  return function (request: Request): unknown {
    return request.query[key];
  };
}

function setLocalValue<T>(key: string) {
  return function (response: Response, value: T): void {
    response.locals[key] = value;
  };
}

function validateID(value: unknown): number {
  if (typeof value !== "string") {
    throw new TypeError(`'${value}' should be a single string value.`);
  }

  const num = Number(value);

  if (!(Number.isInteger(num) && num >= 0)) {
    throw new ValueError(`'${value}' is not a valid ID.`);
  }

  return num;
}

export function parseRouteId(key: string) {
  return mutateRequestValue(
    getRouteParameter(key),
    validateID,
    setLocalValue(key)
  );
}