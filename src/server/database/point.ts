import { DataType, Table, Column, Model, HasOne } from "sequelize-typescript";
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

  @HasOne(() => QRCode)
    qrcode?: QRCode;

  @HasOne(() => User)
    redeemer?: User;

  @Column({
    allowNull: false,
  })
    value!: number;
}