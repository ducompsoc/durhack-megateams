import { DataType, Table, Column, Model, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript"
import config from "config"

import { QRCategory } from "@server/common/model_enums"
import { config_schema } from "@server/common/schema/config"

import User from "./user"
import Point from "./point"

const redemption_url = config_schema.shape.megateams.shape.QRCodeRedemptionURL.parse(
  config.get("megateams.QRCodeRedemptionURL"),
)

@Table
export default class QRCode extends Model {
  @Column({
    field: "qrcode_id",
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string

  @Column({
    type: DataType.ENUM(...Object.values(QRCategory)),
    defaultValue: QRCategory.workshop,
    allowNull: false,
  })
  declare category: QRCategory

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare payload: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare points_value: number

  @Column({
    type: DataType.INTEGER,
  })
  declare max_uses: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare state: boolean

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare start_time: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiry_time: Date

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare creator_id: number

  @BelongsTo(() => User, "creator_id")
  declare creator: Awaited<User>

  @HasMany(() => Point)
  declare uses: Awaited<Point>[]

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  declare challenge_rank: number | null

  async canBeRedeemed(user: Awaited<User>): Promise<boolean> {
    const now = new Date()

    if (now < this.start_time) return false
    if (now >= this.expiry_time) return false
    if (!this.state) return false

    const numberOfUses = await this.$count("uses")
    if (numberOfUses >= this.max_uses) return false

    const redeemsByUser = await this.$count("uses", {
      where: {
        redeemer_id: user.id,
      },
    })
    return redeemsByUser === 0
  }

  getRedemptionURL() {
    const redemptionUrlSearchParams = new URLSearchParams({ qr_id: this.payload })
    return `${redemption_url}?${redemptionUrlSearchParams.toString()}`
  }
}
