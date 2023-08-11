import "../common/config";
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize-typescript";
import { Model, WhereOptions, Attributes, OrderItem, FindOptions } from "sequelize";
import { Request } from "express";
import createHttpError from "http-errors";

import { NullError } from "@server/common/errors";

import User from "./user";
import Team from "./team";
import Area from "./area";
import Megateam from "./megateam";
import Point from "./point";
import QRCode from "./qr_code";

export interface SequelizeQueryTransform<M extends Model> {
  condition: WhereOptions<Attributes<M>>
  replacements?: Map<string, string>
  orders?: OrderItem[]
}

export type SequelizeQueryTransformFactory<M extends Model> = (value: string) => SequelizeQueryTransform<M>

export function buildQueryFromRequest<M extends Model>(request: Request, transforms: Map<string, SequelizeQueryTransformFactory<M>>): FindOptions<M> {
  const options = {
    where: [] as WhereOptions<M>[],
    replacements: new Map<string, string>(),
    order: [] as OrderItem[],
  };

  // https://stackoverflow.com/a/17385088
  for (let parameterName in request.query) {
    if (!request.query.hasOwnProperty(parameterName)) {
      continue;
    }

    const parameterValue = request.query[parameterName];

    if (typeof parameterValue !== "string") {
      throw new createHttpError.BadRequest(`query parameter '${parameterName}' should contain a single string.`);
    }

    const transformFactory = transforms.get(parameterName);
    if (transformFactory === undefined) {
      throw new createHttpError.BadRequest(`Invalid query parameter '${parameterName}'`);
    }

    const transform = transformFactory(parameterValue);

    if (transform.condition) {
      options.where.push(transform.condition);
    }

    if (transform.replacements) {
      for (let [k,v] of transform.replacements.entries()) {
        options.replacements.set(k, v);
      }
    }

    if (transform.orders) {
      options.order.push(...transform.orders);
    }
  }

  const findOptions: FindOptions<M> = {};

  if (options.where.length > 0) {
    findOptions.where = options.where as WhereOptions<M>;
  }

  if (options.replacements.size > 0) {
    findOptions.replacements = Object.fromEntries(options.replacements);
  }

  if (options.order.length > 0) {
    findOptions.order = options.order;
  }

  return findOptions;
}


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
