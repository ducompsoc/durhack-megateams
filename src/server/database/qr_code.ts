import { DataType, Table, Column, Model, BelongsTo, ForeignKey } from "sequelize-typescript";
import { QRCodeModel } from "@server/common/models";
import User from "./user";
import {Col} from "sequelize/types/utils";

interface qrcodeIdentifier {
  id: number,
  name: string,
}

@Table
export default class QRCode extends Model implements QRCodeModel {
  @Column({
    field: "qrcode_id",
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    creator_user_id!: number;

  @BelongsTo(() => User)
    creator!: User;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    description?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
    expiry_time!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    payload!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    points_value!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
    start_time!: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
    state!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
    challenge_rank?: number;
}
