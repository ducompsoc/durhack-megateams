import { Router as ExpressRouter } from "express"

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

import { teamsHandlers } from "./teams-handlers"

const teamsRouter = ExpressRouter()

teamsRouter
  .route("/")
  .get(teamsHandlers.listTeamsAsAdmin(), teamsHandlers.listTeamsAsAnonymous())
  .post(teamsHandlers.createTeamAsAdmin(), teamsHandlers.createTeamAsHacker(), handleFailedAuthentication)

teamsRouter.route("/generate-name").get(teamsHandlers.generateTeamName()).all(handleMethodNotAllowed)

teamsRouter
  .route("/:team_id/memberships")
  .all(parseRouteId("team_id"))
  .post(teamsHandlers.addUserToTeamAsAdmin(), handleFailedAuthentication)
  .delete(teamsHandlers.removeUserFromTeamAsAdmin(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

teamsRouter
  .route("/:team_id")
  .all(parseRouteId("team_id"))
  .get(teamsHandlers.getTeamDetails())
  .patch(teamsHandlers.patchTeamAsAdmin(), handleFailedAuthentication)
  .delete(teamsHandlers.deleteTeam())
  .all(handleMethodNotAllowed)

export default teamsRouter
