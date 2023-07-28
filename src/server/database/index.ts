import "../common/config";
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize-typescript";

import { NullError } from "@server/common/errors";

import User from "./user";
import Team from "./team";
import Area from "./area";
import Megateam from "./megateam";
import Point from "./point";
import QRCode from "./qr_code";


export async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host    : process.env.DATABASE_HOST,
    port    : Number(process.env.DATABASE_PORT),
    user    : process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });

  if (!process.env.DATABASE_NAME) {
    throw new NullError("Database name cannot be null!");
  }

  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\`;`);
}

const sequelize = new Sequelize({
  host    : process.env.DATABASE_HOST,
  port    : Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect : "mysql",
});

sequelize.addModels([
  User,
  Team,
  Area,
  Megateam,
  Point,
  QRCode,
]);

export default sequelize;
