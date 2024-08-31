import createHttpError, { isHttpError } from "http-errors"
import type { NextFunction } from "express"
import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import type { Request, Response } from "@server/types"
import { sendHttpErrorResponse, sendZodErrorResponse } from "@server/common/response"
import { NullError, ValueError } from "@server/common/errors"

export function apiErrorHandler(error: Error, _request: Request, response: Response, next: NextFunction) {
  if (response.headersSent) {
    return next(error)
  }

  if (isHttpError(error)) {
    return sendHttpErrorResponse(response, error)
  }

  if (error instanceof ZodError) {
    return sendZodErrorResponse(response, error)
  }

  if (error instanceof ValueError) {
    return sendHttpErrorResponse(response, new createHttpError.BadRequest(error.message))
  }

  if (error instanceof NullError) {
    return sendHttpErrorResponse(response, new createHttpError.NotFound(error.message))
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    const httpError = new createHttpError.BadRequest(
      "Something failed database client validation."
    )
    return sendHttpErrorResponse(response, httpError)
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let httpError: createHttpError.HttpError | undefined
    // unique constraint failed
    if (error.code === "P2002") {
      httpError = new createHttpError.Conflict(error.message)
    }

    // foreign key constraint failed
    if (error.code === "P2003") {
      httpError = new createHttpError.Conflict(error.message)
    }

    httpError ??= new createHttpError.BadRequest(error.message)

    return sendHttpErrorResponse(response, httpError)
  }

  console.error("Unexpected API error:")
  console.error(error.stack)
  return sendHttpErrorResponse(response, new createHttpError.InternalServerError())
}
