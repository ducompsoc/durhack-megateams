import "./common/config";
import express from "express";
import "./path-alias";
import passport from "passport";
import session from "./common/session";
import next_app, { handle_next_app_request } from "./common/next";
import auth_router from "./common/auth";
import api_router from "./routes";

const dev = process.env.NODE_ENV !== "production";

async function main() {
  await next_app.prepare();
  const server = express();

  server.use(session);
  server.use(passport.authenticate("session"));

  server.use("/", auth_router);
  server.use("/api", api_router);
  server.use("/", (request, response) => {
    return handle_next_app_request(request, response);
  });

  server.listen(3000, "localhost", () => {
    console.log(`> Server listening on http://localhost:3000 as ${dev ? "development" : process.env.NODE_ENV}`);
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
