import { DataType, Table, Column, Model, BelongsTo, ForeignKey } from "sequelize-typescript";

import QRCode from "./qr_code";
import User from "./user";


@Table
export default class Point extends Model {
  @Column({
    field: "point_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare value: number;

  @ForeignKey(() => QRCode)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare origin_qrcode_id: number | null;

  @BelongsTo(() => QRCode, "origin_qrcode_id")
  declare qrcode?: Awaited<QRCode>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare redeemer_id: number;

  @BelongsTo(() => User, "redeemer_id")
  declare redeemer: Awaited<User>;

  static getPointsTotal(points: Point[]): number {
    return points.reduce((accumulator: number, currentPoint: Point) => accumulator + currentPoint.value, 0);
  }
}
