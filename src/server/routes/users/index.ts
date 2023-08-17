import { Router as ExpressRouter } from "express";

import * as handlers from "./user_handlers";
import { handleMethodNotAllowed } from "@server/common/middleware";


const users_router = ExpressRouter();

users_router.route("/")
  .get(handlers.getUsersList)
  .post(handlers.createUser)
  .all(handleMethodNotAllowed);

users_router.route("/:user_id")
  .get(handlers.getUserDetails)
  .patch(handlers.patchUserDetails)
  .delete(handlers.deleteUser)
  .all(handleMethodNotAllowed);

export default users_router;