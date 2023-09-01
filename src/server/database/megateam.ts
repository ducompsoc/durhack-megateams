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

  @HasMany(() => Area, "megateam_id")
    areas!: Area[];
}
