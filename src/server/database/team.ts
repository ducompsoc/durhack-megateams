import {
  DataType,
  Table,
  Column,
  Model,
  HasMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";

import Area from "./area";
import User from "./user";

@Table
export default class Team extends Model {
  @Column({
    field: "team_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    get() {
      return this.getDataValue("join_code")
        .toString(16)
        .padStart(4, "0")
        .toUpperCase();
    },
  })
  join_code!: number;

  @Column({
    field: "team_name",
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @ForeignKey(() => Area)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  area_id?: number;
  @BelongsTo(() => Area, "area_id")
  area?: Area;

  @HasMany(() => User)
  members?: User[];
}
