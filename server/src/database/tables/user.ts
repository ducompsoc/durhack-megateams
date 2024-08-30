import { DataType, Table, Column, Model, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript"

import { UserRole } from "@server/common/model-enums"

import Team from "./team"
import Point from "./point"
import QRCode from "./qr_code"

@Table
export default class User extends Model {
  @Column({
    field: "user_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare team_id: number | null

  @BelongsTo(() => Team, "team_id")
  declare team: Awaited<Team>

  @HasMany(() => QRCode, "creator_id")
  declare createdQRCodes: Awaited<QRCode>[]

  @HasMany(() => Point, "redeemer_id")
  declare points: Awaited<Point>[]

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare preferred_name: string

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.hacker,
    allowNull: false,
  })
  declare role: UserRole

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare initially_logged_in_at: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare last_logged_in_at: Date | null

  static async listUsers(): Promise<Pick<User, "id" | "email">[]> {
    throw new Error("Not implemented.")
  }
}
