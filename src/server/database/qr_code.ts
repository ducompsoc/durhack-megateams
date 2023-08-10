import {DataType, Table, Column, Model, BelongsTo, HasMany, ForeignKey} from "sequelize-typescript";
import { QRCategory } from "@server/common/model_enums";
import User from "./user";
import Point from "./point";


@Table
export default class QRCode extends Model {
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
    creator_id!: number;
  @BelongsTo(() => User, "creator_id")
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
