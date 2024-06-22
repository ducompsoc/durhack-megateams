import config from "config"
import { z } from "zod"
import { DataType, Table, Column, Model, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript"

import { config_schema } from "@server/common/schema/config"

import Area from "./area"
import User from "./user"

const maxTeamMembers = config_schema.shape.megateams.shape.maxTeamMembers.parse(config.get("megateams.maxTeamMembers"))

@Table
export default class Team extends Model {
  @Column({
    field: "team_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    get() {
      return this.getDataValue("join_code").toString(16).padStart(4, "0").toUpperCase()
    },
  })
  declare join_code: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare discord_channel_id: string

  @Column({
    field: "team_name",
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string

  @ForeignKey(() => Area)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare area_id: number | null

  @BelongsTo(() => Area, "area_id")
  declare area: Awaited<Area>

  @HasMany(() => User)
  declare members: Awaited<User>[]

  async isJoinable(): Promise<boolean> {
    const team_members: number = await this.$count("members")
    return team_members < maxTeamMembers
  }
}
