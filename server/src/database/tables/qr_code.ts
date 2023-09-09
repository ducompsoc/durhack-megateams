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
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(QRCategory)),
    defaultValue: QRCategory.workshop,
    allowNull: false,
  })
  declare category: QRCategory;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare payload: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare points_value: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare max_uses: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare state: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare start_time: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiry_time: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare creator_id: number;

  @BelongsTo(() => User, "creator_id")
  declare creator: User;

  @HasMany(() => Point)
  declare uses: Point[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  declare challenge_rank: number | null;

  async canBeRedeemed() {
    const now = new Date();

    if (now < this.start_time) return false;
    if (now >= this.expiry_time) return false;
    if (!this.state) return false;

    const numberOfUses = await this.$count("uses");
    return (numberOfUses) < this.max_uses;
  }
}