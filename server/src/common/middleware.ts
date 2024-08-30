import type { NextFunction } from "express";
import createHttpError from "http-errors";

import { ValueError } from "@server/common/errors";
import type { Middleware, Request, Response } from "@server/types";

export function handleMethodNotAllowed() {
  // The endpoint does support this method: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
  throw new createHttpError.MethodNotAllowed();
}

export function handleNotImplemented() {
  throw new createHttpError.NotImplemented()
}

export function handleFailedAuthentication(request: Request) {
  if (request.user) {
    // Re-authenticating will not allow access (i.e. you are not a high-enough privileged user):
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
    throw new createHttpError.Forbidden()
  }
  // Lacking any credentials at all: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
  throw new createHttpError.Unauthorized()
}

function getRouteParameter(key: string) {
  return (request: Request): unknown => request.params[key]
}

function getQueryParameter(key: string) {
  return (request: Request): unknown => request.query[key]
}

function setLocalValue<T>(key: string) {
  return (response: Response, value: T): void => {
    response.locals[key] = value
  }
}

function parseId(value: unknown): number {
  if (typeof value !== "string") {
    throw new TypeError(`'${value}' should be a single string value.`)
  }

  const num = Number(value)

  if (!(Number.isInteger(num) && num >= 0)) {
    throw new ValueError(`'${value}' is not a valid ID.`)
  }

  return num
}

/**
 * Attempts to parse a given route parameter (key) as a number to use as an ID
 * @param key - The key of the route parameter to parse as an ID
 * @returns A middleware function that takes a request, response, and next function.
 * The key is extracted from the request's params and set in the local key of the response.
 */
export function parseRouteId(key: string): Middleware {
  return (request, response, next) => {
    const id = getRouteParameter(key)
    response.locals[key] = parseId(id);
    next()
  }
}

export function useSelfId(request: Request, response: Response, next: NextFunction): void {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  response.locals.user_id = request.user.keycloakUserId
  next()
}
