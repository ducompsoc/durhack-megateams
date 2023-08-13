import { Router as ExpressRouter } from "express";

import { handleMethodForbidden } from "@server/common/middleware";

import * as handlers from "./team_handlers";


const teams_router = ExpressRouter();

teams_router.route("/")
  .get(handlers.getTeamsList)
  .post(handlers.createTeam)
  .all(handleMethodForbidden);

teams_router.route("/:team_id")
  .get(handlers.getTeamDetails)
  .patch(handlers.patchTeamDetails)
  .delete(handlers.deleteTeam)
  .all(handleMethodForbidden);

export default teams_router;