import createHttpError from "http-errors";

export function HandleMethodNotAllowed() {
  throw new createHttpError.MethodNotAllowed();
}

export function HandleNotImplemented() {
  throw new createHttpError.NotImplemented();
}