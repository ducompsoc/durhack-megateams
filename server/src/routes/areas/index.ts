import { Router as ExpressRouter } from "express";

import {
  handleFailedAuthentication,
  handleMethodNotAllowed,
  parseRouteId
} from "@server/common/middleware";

import handlers from "./area_handlers";


const areas_router = ExpressRouter();

areas_router.route("/")
  .get(handlers.getAreasList, handleFailedAuthentication)
  .post(handlers.createArea, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

areas_router.route("/:area_id")
  .all(parseRouteId("area_id"))
  .get(handlers.getAreaDetails, handleFailedAuthentication)
  .patch(handlers.patchAreaDetails, handleFailedAuthentication)
  .delete(handlers.deleteArea, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

export default areas_router;
