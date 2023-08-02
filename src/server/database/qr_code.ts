import { DataType, Table, Column, Model, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import {QRCategory, QRCodeModel} from "@server/common/models";
import User from "./user";
import Point from "./point";


export type qrcodeIdentifier = Pick<QRCodeModel, "id" | "name">

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

  @Column({
    type: DataType.ENUM(...Object.values(QRCategory)),
    defaultValue: QRCategory.workshop,
    allowNull: false,
  })
    category!: QRCategory;

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
    type: DataType.BOOLEAN,
    allowNull: false,
  })
    state!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
    start_time!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
    expiry_time!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    creator_user_id!: number;

  @BelongsTo(() => User)
    creator!: User;

  @HasMany(() => Point)
    uses?: Point[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
    challenge_rank?: number;
}
