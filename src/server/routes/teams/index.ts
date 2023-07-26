import { Router as ExpressRouter } from "express";

import { handleMethodNotAllowed } from "@server/common/middleware";

import * as handlers from "./team_handlers";


const teams_router = ExpressRouter();

teams_router.route("/")
  .get(handlers.getTeamsList)
  .post(handlers.createTeam)
  .all(handleMethodNotAllowed);

teams_router.route("/:team_id")
  .get(handlers.getTeamDetails)
  .patch(handlers.patchTeamDetails)
  .delete(handlers.deleteTeam)
  .all(handleMethodNotAllowed);

export default teams_router;