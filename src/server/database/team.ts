import { DataType, Table, Column, Model, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";

import { TeamModel } from "@server/common/models";

import Area from "./area";
import User from "./user";


export type teamIdentifier = Pick<TeamModel, "id" | "name">

@Table
export default class Team extends Model implements TeamModel {
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

  static async listTeams(): Promise<teamIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getTeam(id: number): Promise<TeamModel> {
    throw new Error("Not implemented.");
  }
}
