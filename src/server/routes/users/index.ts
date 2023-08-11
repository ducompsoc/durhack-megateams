import { NextFunction, Request, Response, Router as ExpressRouter } from "express";

import * as handlers from "./user_handlers";
import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware";
import createHttpError from "http-errors";


function useSelfId(request: Request, response: Response, next: NextFunction) {
  if (!request.user) {
    throw new createHttpError.Unauthorized();
  }

  response.locals.user_id = request.user.id;
  response.locals.isSelfRequest = true;
  next();
}

const users_router = ExpressRouter();

users_router.route("/")
  .get(handlers.getUsersListAsAdmin, handlers.getUsersListDefault)
  .post(handlers.createUserAsAdmin, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

users_router.route("/me")
  .all(useSelfId)
  .get(handlers.getUserDetailsAsAdmin, handlers.getMyUserDetails)
  .patch(handlers.patchUserDetailsAsAdmin, handlers.patchMyUserDetails)
  .delete(handlers.deleteUserAsAdmin)
  .all(handleMethodNotAllowed);

users_router.route("/:user_id")
  .all(parseRouteId("user_id"), handlers.setSelfRequestFlag)
  .get(handlers.getUserDetailsAsAdmin, handlers.getUserDetailsDefault)
  .patch(handlers.patchUserDetailsAsAdmin, handlers.patchMyUserDetails, handleFailedAuthentication)
  .delete(handlers.deleteUserAsAdmin, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

export default users_router;