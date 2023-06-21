import { Request, Response, Router as ExpressRouter } from "express";
import passport from "passport";
import Local from "passport-local";
import { handle_next_app_request } from "./next";

const local_strategy = new Local.Strategy(async function verify(username, password, callback) {

});

passport.use("local", local_strategy);

passport.serializeUser(async function(user, callback) {

});

passport.deserializeUser(async function(id, callback) {

});

const auth_router = new ExpressRouter();

auth_router.get("/login", function(request: Request, response: Response) {
  return handle_next_app_request(request, response);
});

auth_router.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true
}));

auth_router.get("/signup", function(request: Request, response: Response) {
  return handle_next_app_request(request, response);
});

auth_router.post("/signup", function(request: Request, response: Response) {

});

export default auth_router;