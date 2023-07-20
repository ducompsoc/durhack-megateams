import { Router as ExpressRouter } from "express";

import * as handlers from "./user_handlers";
import { HandleMethodNotAllowed } from "@/server/common/middleware";


const users_router = ExpressRouter();

users_router.route("/")
  .get(handlers.getUsersList)
  .post(handlers.createUser)
  .all(HandleMethodNotAllowed);

users_router.route("/:user_id")
  .get(handlers.getUserDetails)
  .patch(handlers.patchUserDetails)
  .delete(handlers.deleteUser)
  .all(HandleMethodNotAllowed);

export default users_router;