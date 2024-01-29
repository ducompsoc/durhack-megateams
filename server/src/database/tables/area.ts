import { DataType, Table, Column, Model, HasOne, BelongsTo, ForeignKey } from "sequelize-typescript"

import Megateam from "./megateam"
import Team from "./team"

@Table
export default class Area extends Model {
  @Column({
    field: "area_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number

  @ForeignKey(() => Megateam)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare megateam_id: number

  @BelongsTo(() => Megateam, "megateam_id")
  declare megateam: Awaited<Megateam>

  @HasOne(() => Team, "area_id")
  declare team: Awaited<Team>

  @Column({
    field: "area_name",
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string

  @Column({
    field: "area_location",
    type: DataType.STRING,
    allowNull: false,
  })
  declare location: string
}
