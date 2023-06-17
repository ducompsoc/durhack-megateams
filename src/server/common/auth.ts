import { Router as ExpressRouter } from "express";
import passport from "passport";
import Local from "passport-local";
import { handle_next_app_request } from "./next";

const local_strategy = new Local.Strategy(async function verify(username, password, callback) {

});

passport.use("local", local_strategy);

passport.serializeUser(async function(user, callback) {

});

passport.deserializeUser(async function(user, callback) {

});

const auth_router = new ExpressRouter();

auth_router.get("/login", function(request, response) {
  return handle_next_app_request(request, response);
});

auth_router.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true
}));

auth_router.get("/signup", function(request, response) {
  return handle_next_app_request(request, response);
});

auth_router.post("/signup", function(request, response, next) {

});

export default auth_router;