import session, { MemoryStore, SessionOptions } from "express-session";
import MySQLStore from "express-mysql-session";

function get_mysql_session_store(): ReturnType<MySQLStore> {
  const MySQLStoreClass = MySQLStore(session);

  const options  = {
    host: "localhost",
    port: 3306,
    user: "session_db_user",
    password: "session_db_password",
    database: "session_db"
  };

  return new MySQLStoreClass(options);
}

function get_memory_session_store(): MemoryStore {
  return new MemoryStore();
}

function get_session_store(): session.Store {
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
