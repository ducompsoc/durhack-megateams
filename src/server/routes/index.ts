import { Router as ExpressRouter, Request, Response } from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import auth_router from "./auth";
import areas_router from "./areas";
import megateams_router from "./megateams";
import points_router from "./points";
import qr_codes_router from "./qr_codes";
import teams_router from "./teams";
import users_router from "./users";
import api_error_handler from "./error_handling";
import createHttpError from "http-errors";

const api_router = ExpressRouter();

api_router.use(bodyParser.json());
api_router.use(bodyParser.urlencoded({ extended: true }));

function handle_root_request(request: Request, response: Response) {
  response.status(200);
  response.json({"status": response.statusCode, "message": "OK", "api_version": 1});
}

function handle_unhandled_request(request: Request, response: Response) {
  response.status(404);
  response.json({"status": response.statusCode, "message": "Unknown API route."});
}

api_router.route("/")
  .get(handle_root_request);

api_router.use("/auth", auth_router);
api_router.use("/areas", areas_router);
api_router.use("/megateams", megateams_router);
api_router.use("/points", points_router);
api_router.use("/qr_codes", qr_codes_router);
api_router.use("/teams", teams_router);
api_router.use("/users", users_router);

api_router.route("/*")
  .all(handle_unhandled_request);

api_router.use(methodOverride());
api_router.use(api_error_handler);

export default api_router;