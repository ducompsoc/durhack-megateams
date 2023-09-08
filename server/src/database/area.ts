import {DataType, Table, Column, Model, HasOne, BelongsTo, ForeignKey} from "sequelize-typescript";

import Megateam from "@server/database/megateam";

import Team from "./team";


@Table
export default class Area extends Model {
  @Column({
    field: "area_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @ForeignKey(() => Megateam)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    megateam_id!: number;
  @BelongsTo(() => Megateam, "megateam_id")
    megateam!: Megateam;

  @HasOne(() => Team, "area_id")
    team?: Team;

  @Column({
    field: "area_name",
    type: DataType.STRING,
    allowNull: false,
  })
    name!: string;

  @Column({
    field: "area_location",
    type: DataType.STRING,
    allowNull: false,
  })
    location!: string;
}
