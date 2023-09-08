import {DataType, Table, Column, Model, BelongsTo, ForeignKey} from "sequelize-typescript";

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
    id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    value!: number;

  @ForeignKey(() => QRCode)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
    origin_qrcode_id?: number;
  @BelongsTo(() => QRCode, "origin_qrcode_id")
    qrcode?: QRCode;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    redeemer_id!: number;
  @BelongsTo(() => User, "redeemer_id")
    redeemer!: User;

  static getPointsTotal(points: Point[]): number {
    return points.reduce((accumulator: number, currentPoint: Point) => accumulator + currentPoint.value, 0);
  }
}
