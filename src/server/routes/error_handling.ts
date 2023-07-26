import createHttpError, { isHttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";

import { sendHttpErrorResponse } from "@server/common/response";


export default function api_error_handler(error: Error, request: Request, response: Response, next: NextFunction) {
  if (response.headersSent) {
    return next(error);
  }

  if (isHttpError(error)) {
    return sendHttpErrorResponse(response, error);
  }

  console.error("Unexpected API error:");
  Error.captureStackTrace(error);
  console.error(error.stack);
  return sendHttpErrorResponse(response, new createHttpError.InternalServerError());
}