import { Router as ExpressRouter } from "express";

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware";

import handlers from "./user_handlers";
import { useSelfId } from "./user_util";


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
  .all(parseRouteId("user_id"))
  .get(handlers.getUserDetailsAsAdmin, handlers.getUserDetailsDefault)
  .patch(handlers.patchUserDetailsAsAdmin, handlers.patchMyUserDetails, handleFailedAuthentication)
  .delete(handlers.deleteUserAsAdmin, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

export default users_router;