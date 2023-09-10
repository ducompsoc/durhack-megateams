import config from "config";
import mysql, { ConnectionOptions as MySqlConnectionOptions } from "mysql2/promise";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Model, WhereOptions, Attributes, OrderItem, FindOptions } from "sequelize";
import { Request } from "express";
import createHttpError from "http-errors";

import { mysql_options_schema, sequelize_options_schema } from "@server/common/schema/config";

import {
  User,
  Team,
  Area,
  Megateam,
  Point,
  QRCode,
} from "./tables";


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
  for (const parameterName in request.query) {
    // https://github.com/hapijs/hapi/issues/3280#issuecomment-237397365
    if (!Object.prototype.hasOwnProperty.call(request.query, parameterName)) {
      continue;
    }

    const parameterValue = request.query[parameterName];

    if (typeof parameterValue !== "string") {
      throw new createHttpError.BadRequest(`Query parameter '${parameterName}' should be a string.`);
    }

    const transformFactory = transforms.get(parameterName);
    if (transformFactory === undefined) {
      throw new createHttpError.BadRequest(`Query parameter '${parameterName}' is invalid.`);
    }

    const transform = transformFactory(parameterValue);

    if (transform.condition) {
      options.where.push(transform.condition);
    }

    if (transform.replacements) {
      for (const [k,v] of transform.replacements.entries()) {
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
  const initialConnectOptions = mysql_options_schema.parse(config.get("mysql.data")) as MySqlConnectionOptions;
  const database_name = initialConnectOptions.database;

  if (!database_name) {
    throw new Error("Database name cannot be falsy!");
  }

  delete initialConnectOptions.database;
  const connection = await mysql.createConnection(initialConnectOptions);

  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database_name}\`;`);

  await connection.destroy();
}

const sequelizeConnectOptions = sequelize_options_schema.parse(config.get("mysql.data")) as SequelizeOptions;

const sequelize = new Sequelize(sequelizeConnectOptions);

sequelize.addModels([
  User,
  Team,
  Area,
  Megateam,
  Point,
  QRCode,
]);

export default sequelize;
