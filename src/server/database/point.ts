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
    qrcode_id?: number;

  @BelongsTo(() => QRCode)
    qrcode?: QRCode;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    redeemer_user_id!: number;

  @BelongsTo(() => User)
    redeemer!: User;
}
