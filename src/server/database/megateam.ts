import { DataType, Table, Column, Model, HasMany } from "sequelize-typescript";
import { MegateamModel } from "@server/common/models";
import Area from "./area";


export type megateamIdentifier = Pick<MegateamModel, "id" | "name">

@Table
export default class Megateam extends Model implements MegateamModel {
  @Column({
    field: "megateam_id",
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @Column({
    field: "megateam_name",
    type: DataType.STRING,
    allowNull: false,
  })
    name!: string;

  @Column({
    field: "megateam_description",
    type: DataType.STRING,
    allowNull: true,
  })
    description?: string;

  @HasMany(() => Area)
    areas!: Area[];

  static async listMegateams(): Promise<megateamIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getMegateam(id: number): Promise<MegateamModel> {
    throw new Error("Not implemented.");
  }
}
