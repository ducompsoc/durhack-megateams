import { DataType, Table, Column, Model, BelongsTo, ForeignKey } from "sequelize-typescript";
import { PointModel } from "@/server/common/models";
import QRCode from "./qr_code";
import User from "./user";

@Table
export default class Point extends Model implements PointModel {
  @Column({
    field: "point_id",
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @ForeignKey(() => QRCode)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
    qrcode_id?: number;

  @BelongsTo(() => QRCode)
    qrcode?: QRCode;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    redeeemer_user_id!: number;

  @BelongsTo(() => User)
    redeemer!: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    value!: number;
}