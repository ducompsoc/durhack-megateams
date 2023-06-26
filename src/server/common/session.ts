import session, { MemoryStore, Store, SessionOptions } from "express-session";
import * as constructor_session from "express-session";
import MySQLStoreMeta, { MySQLStore as MySQLStoreType } from "express-mysql-session";

function get_mysql_session_store(): MySQLStoreType {
  const MySQLStore = MySQLStoreMeta(constructor_session);

  const options  = {
    host     : process.env.SESSION_DATABASE_HOST,
    port     : Number(process.env.SESSION_DATABASE_PORT),
    user     : process.env.SESSION_DATABASE_USER,
    password : process.env.SESSION_DATABASE_PASSWORD,
    database : process.env.SESSION_DATABASE_NAME
  };

  return new MySQLStore(options);
}

function get_memory_session_store(): MemoryStore {
  return new MemoryStore();
}

function get_session_store(): Store {
  if (process.env.NODE_ENV !== "production") {
    return get_memory_session_store();
  }

  return get_mysql_session_store();
}

const sessionStore = get_session_store();

const session_options: SessionOptions = {
  name: "session_cookie_name",
  secret: "session_cookie_secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {}
};

if (process.env.NODE_ENV !== "production") {
  if (session_options.cookie) {
    session_options.cookie.secure = true;
  }
}

export default session(session_options);
