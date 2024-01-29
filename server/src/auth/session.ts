import config from "config"
import session, { MemoryStore, SessionOptions, Store } from "express-session"
import * as constructor_session from "express-session"
import MySQLStoreMeta, { MySQLStore as MySQLStoreType } from "express-mysql-session"
import * as process from "process"

import { mysql_options_schema, session_options_schema } from "@server/common/schema/config"

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    generatedTeamName?: string
    redirect_to?: string
  }
}

function get_mysql_session_store(): MySQLStoreType {
  const MySQLStore = MySQLStoreMeta(constructor_session)
  const options = mysql_options_schema.parse(config.get("mysql.session"))
  return new MySQLStore(options)
}

function get_memory_session_store(): MemoryStore {
  return new MemoryStore()
}

function get_session_store(): Store {
  if (process.env.NODE_ENV !== "production") {
    return get_memory_session_store()
  }

  return get_mysql_session_store()
}

const sessionStore = get_session_store()

const session_options = session_options_schema.parse(config.get("session")) as SessionOptions
session_options.store = sessionStore

export default session(session_options)
