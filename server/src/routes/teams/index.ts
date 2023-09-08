import { Router as ExpressRouter } from "express";

import {
  handleFailedAuthentication,
  handleMethodNotAllowed,
  parseRouteId,
} from "@server/common/middleware";

import handlers from "./teams_handlers";


const teams_router = ExpressRouter();

teams_router.route("/")
  .get(
    handlers.listTeamsAsAdmin,
    handlers.listTeamsAsAnonymous,
  )
  .post(
    handlers.createTeamAsAdmin,
    handlers.createTeamAsHacker,
    handleFailedAuthentication,
  );

teams_router.route("/generate-name")
  .get(handlers.generateTeamName)
  .all(handleMethodNotAllowed);

teams_router.route("/:team_id/memberships")
  .all(parseRouteId("team_id"))
  .post(handlers.addUserToTeamAsAdmin, handleFailedAuthentication)
  .delete(handlers.removeUserFromTeamAsAdmin, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

teams_router.route("/:team_id")
  .all(parseRouteId("team_id"))
  .get(handlers.getTeamDetails)
  .patch(handlers.patchTeamAsAdmin, handleFailedAuthentication)
  .delete(handlers.deleteTeam)
  .all(handleMethodNotAllowed);

export default teams_router;
