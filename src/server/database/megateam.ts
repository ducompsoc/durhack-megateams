import { DataType, Table, Column, Model, HasMany } from "sequelize-typescript";
import Area from "./area";


@Table
export default class Megateam extends Model {
  @Column({
    field: "megateam_id",
    type: DataType.INTEGER,
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

  static async listMegateams(): Promise<Pick<Megateam, "id" | "name">[]> {
    throw new Error("Not implemented.");
  }

  static async getMegateam(id: number): Promise<Megateam> {
    throw new Error("Not implemented.");
  }
}
