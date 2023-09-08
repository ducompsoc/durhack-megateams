import "./path-alias";
import "./common/config";

import express from "express";
import passport from "passport";

import session from "./common/session";
import sequelize, { ensureDatabaseExists } from "./database";
import api_router from "./routes";

const dev = process.env.NODE_ENV !== "production";
process.env.TZ = "Europe/London";

async function main() {
  await next_app.prepare();
  await ensureDatabaseExists();

  // Run with the force: true option to update your schema if your server's schema
  // is out-of-date compared to the code's schema. Note this will wipe your database.
  // https://github.com/ducompsoc/durhack-megateams/pull/32#issuecomment-1652556468
  await sequelize.sync({ force: false });

  const server = express();

  server.use(session);
  server.use(passport.authenticate("session"));

  server.use("/api", api_router);

  server.listen(3000, "localhost", () => {
    console.log(`> Server listening on http://localhost:3000 as ${dev ? "development" : process.env.NODE_ENV}`);
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
