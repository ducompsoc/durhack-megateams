import "../common/config";
import mysql from "mysql2";

const pool = mysql.createPool({
  connectionLimit: 100,
  host     : process.env.DATABASE_HOST,
  port     : Number(process.env.DATABASE_PORT),
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE_NAME
});

const promise_pool = pool.promise();

export default promise_pool;