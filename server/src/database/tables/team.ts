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
  declare id: number;

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
  declare join_code: number;

  @Column({
    field: "team_name",
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @ForeignKey(() => Area)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare area_id: number | null;

  @BelongsTo(() => Area, "area_id")
  declare area: Area;

  @HasMany(() => User)
  declare members: User[];

  async isJoinable() {
    const team_members: number = await this.$count("members");
    return (team_members < Number(process.env.MAX_TEAM_MEMBERS));
  }
}
