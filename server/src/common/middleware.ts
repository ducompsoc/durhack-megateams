import createHttpError from "http-errors"
import { NextFunction, Request, Response } from "express"
import { ValueError } from "@server/common/errors"

export function handleMethodNotAllowed() {
  // The endpoint does support this method: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
  throw new createHttpError.MethodNotAllowed()
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

export function mutateRequestValue<T>(
  getter: (request: Request) => unknown,
  mutator: (value: unknown) => T,
  setter: (response: Response, value: T) => void,
) {
  return function (request: Request, response: Response, next: NextFunction) {
    const valueToMutate = getter(request)
    const mutatedValue = mutator(valueToMutate)
    setter(response, mutatedValue)
    next()
  }
}

function getRouteParameter(key: string) {
  return function (request: Request): unknown {
    return request.params[key]
  }
}

function getQueryParameter(key: string) {
  return function (request: Request): unknown {
    return request.query[key]
  }
}

function setLocalValue<T>(key: string) {
  return function (response: Response, value: T): void {
    response.locals[key] = value
  }
}

function validateID(value: unknown): number {
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
export function parseRouteId(key: string) {
  return mutateRequestValue(
    getRouteParameter(key), // returns a function that takes a request and returns the value key from the request's params
    validateID, // function validates whether input value is a valid ID (i.e. number >= 0) & returns number in this case
    setLocalValue(key), // returns a function that takes a response and a value and sets the response's local key to the value
  )
}

export function useSelfId(request: Request, response: Response, next: NextFunction): void {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  response.locals.user_id = request.user.id
  next()
}
