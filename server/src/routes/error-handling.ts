import createHttpError, { isHttpError } from "http-errors"
import type { NextFunction } from "express"
import {
  ForeignKeyConstraintError as SequelizeForeignKeyConstraintError,
  ValidationError as SequelizeValidationError,
} from "sequelize"
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

  if (error instanceof SequelizeValidationError) {
    const httpError = new createHttpError.BadRequest(
      `${error.message} with fields: ${error.errors.map(e => `* ${e.path} - ${e.message}`).join("; ")}`,
    )
    return sendHttpErrorResponse(response, httpError)
  }

  if (error instanceof SequelizeForeignKeyConstraintError) {
    let httpError: createHttpError.HttpError
    if (Array.isArray(error.fields)) {
      httpError = new createHttpError.BadRequest(
        `Invalid foreign key(s) provided for field(s): ${error.fields.join(", ")}`,
      )
    } else {
      httpError = new createHttpError.BadRequest(error.message)
    }
    return sendHttpErrorResponse(response, httpError)
  }

  console.error("Unexpected API error:")
  console.error(error.stack)
  return sendHttpErrorResponse(response, new createHttpError.InternalServerError())
}