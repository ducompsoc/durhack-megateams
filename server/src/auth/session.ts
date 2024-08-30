import session, { MemoryStore, type SessionOptions, type Store } from "express-session"
import * as constructor_session from "express-session"
import MySQLStoreMeta, { type MySQLStore as MySQLStoreType } from "express-mysql-session"
import * as process from "node:process"

import { mysqlSessionConfig, sessionConfig } from "@server/config";

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    generatedTeamName?: string
    redirect_to?: string
  }
}

function getMysqlSessionStore(): MySQLStoreType {
  const MySQLStore = MySQLStoreMeta(constructor_session)
  return new MySQLStore(mysqlSessionConfig)
}

function getMemorySessionStore(): MemoryStore {
  return new MemoryStore()
}

function getSessionStore(): Store {
  if (process.env.NODE_ENV !== "production") {
    return getMemorySessionStore()
  }

  return getMysqlSessionStore()
}

const sessionStore = getSessionStore()

const session_options: SessionOptions = Object.assign({}, sessionConfig)
session_options.store = sessionStore

export default session(session_options)
