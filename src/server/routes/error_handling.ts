import createHttpError, { HttpError, isHttpError } from "http-errors";
import { Response } from "express";

interface ErrorResponseBody {
    status: number
    message: string
    detail?: string
}

function make_http_error_response_body(error: HttpError): ErrorResponseBody {
  const response_body: ErrorResponseBody = {
    status: error.statusCode,
    message: error.name
  };

  if (error.message) {
    response_body.detail = error.message;
  }
  return response_body;
}

function send_http_error_response(response: Response, error: HttpError) {
  const response_body = make_http_error_response_body(error);

  response.status(error.statusCode);
  response.json(response_body);
}

export default function api_error_handler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (isHttpError(error)) {
    return send_http_error_response(response, error);
  }

  console.error("Unexpected API error:");
  Error.captureStackTrace(error);
  console.error(error.stack);
  return send_http_error_response(response, new createHttpError.InternalServerError());
}