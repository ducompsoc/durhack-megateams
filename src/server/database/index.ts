import mysql from "mysql2";

const pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "database_user",
  password: "password",
  database: "megateams"
});

const promise_pool = pool.promise();

export default promise_pool;