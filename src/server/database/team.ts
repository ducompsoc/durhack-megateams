import { DataType, Table, Column, Model, HasOne } from "sequelize-typescript";
import { TeamModel } from "@/server/common/models";
import Area from "./area";

interface teamIdentifier {
  id: number,
  name: string,
}

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
    allowNull: false
  })
    name!: string;

  @HasOne(() => Area)
    area?: Area;

  static async listTeams(): Promise<teamIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getTeam(id: number): Promise<TeamModel> {
    throw new Error("Not implemented.");
  }
}
