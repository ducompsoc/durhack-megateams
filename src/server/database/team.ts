import {DataType, Table, Column, Model, HasMany, BelongsTo, ForeignKey} from "sequelize-typescript";

import Area from "./area";
import User from "./user";

@Table
export default class Team extends Model {
  @Column({
    field: "team_id",
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @Column({
    field: "team_name",
    type: DataType.STRING,
    allowNull: false
  })
    name!: string;

  @ForeignKey(() => Area)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
    area_id?: number;

  @BelongsTo(() => Area)
    area?: Area;

  @HasMany(() => User)
    members?: User[];

  static async listTeams(): Promise<Pick<Team, "id" | "name">[]> {
    throw new Error("Not implemented.");
  }

  static async getTeam(id: number): Promise<Team> {
    throw new Error("Not implemented.");
  }
}
