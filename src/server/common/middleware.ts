import createHttpError from "http-errors";

export function handleMethodNotAllowed() {
  throw new createHttpError.MethodNotAllowed();
}

export function handleNotImplemented() {
  throw new createHttpError.NotImplemented();
}