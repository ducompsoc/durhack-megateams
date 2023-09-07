import { Router as ExpressRouter } from "express";

import {
  handleFailedAuthentication,
  handleMethodNotAllowed,
  parseRouteId,
  useSelfId,
} from "@server/common/middleware";

import handlers from "./team_handlers";

const teams_router = ExpressRouter();

teams_router.route("/")
  .get(
    handlers.listTeamsAdmin,
    handlers.listTeamsDefault,
    handleFailedAuthentication
  );

teams_router.route("/mine")
  .all(useSelfId)
  .get(handlers.getMyTeam)
  .post(handlers.createMyTeam)
  .patch(handlers.joinTeam)
  .delete(handlers.leaveMyTeam)
  .all(handleMethodNotAllowed);

teams_router.route("/generateName")
  .get(handlers.generateTeamName)
  .all(handleMethodNotAllowed);

teams_router.route("/:team_id")
  .all(parseRouteId("team_id"))
  .patch(handlers.patchTeamAdmin, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

export default teams_router;
