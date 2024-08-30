import express, { type Express } from "express"
import { type Server, createServer } from "node:http"
import { Server as SocketIO } from "socket.io"
import passport from "passport"
import * as process from "node:process"

import { listenConfig } from "@server/config";

import session from "./auth/session"
import SocketManager from "./socket"
import sequelize, { ensureDatabaseExists } from "./database"
import { apiRouter } from "./routes"
import "./auth"

const environment = process.env.NODE_ENV
const dev = environment !== "production"

function getExpressApp(): Express {
  const app = express()

  app.use(session)
  app.use(passport.initialize())
  app.use(passport.session())

  app.use("/api", apiRouter)

  return app
}

function getServer(app: Express): Server {
  const server = createServer(app)
  const io = new SocketIO(server)
  SocketManager.initialise(io)

  return server
}

async function main() {
  await ensureDatabaseExists()

  if (dev) {
    // Run with the force: true option to update your schema if your server's schema
    // is out-of-date compared to the code's schema. Note this will wipe your database.
    // https://github.com/ducompsoc/durhack-megateams/pull/32#issuecomment-1652556468
    await sequelize.sync({ force: false })
  }

  const app = getExpressApp()
  const server = getServer(app)

  server.listen(listenConfig.port, listenConfig.host, () => {
    console.log(`> Server listening on http://${listenConfig.host}:${listenConfig.port} as ${dev ? "development" : environment}`)
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
