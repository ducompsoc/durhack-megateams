import { Router as ExpressRouter } from "express";

import { HandleMethodNotAllowed } from "@server/common/middleware";

import * as handlers from "./team_handlers";


const teams_router = ExpressRouter();

teams_router.route("/")
  .get(handlers.getTeamsList)
  .post(handlers.createTeam)
  .all(HandleMethodNotAllowed);

teams_router.route("/:team_id")
  .get(handlers.getTeamDetails)
  .patch(handlers.patchTeamDetails)
  .delete(handlers.deleteTeam)
  .all(HandleMethodNotAllowed);

export default teams_router;