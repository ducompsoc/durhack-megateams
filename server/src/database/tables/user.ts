import { DataType, Table, Column, Model, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";

import { UserRole, Ethnicity, Gender } from "@server/common/model_enums";

import Team from "./team";
import Point from "./point";
import QRCode from "./qr_code";

@Table
export default class User extends Model {
  @Column({
    field: "user_id",
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare team_id: number | null;

  @BelongsTo(() => Team, "team_id")
  declare team: Team;

  @HasMany(() => QRCode, "creator_id")
  declare createdQRCodes: QRCode[];

  @HasMany(() => Point, "redeemer_id")
  declare points: Point[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare hashed_password: Buffer | null;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
  declare password_salt: Buffer | null;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.hacker,
    allowNull: false,
  })
  declare role: UserRole;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare verify_code: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare verify_sent_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare initially_logged_in_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare last_logged_in_at: Date | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare h_UK_marketing: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare h_UK_Consent: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare checked_in: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare discord_id: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare discord_name: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare preferred_name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare age: number | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone_number: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare university: string | null;

  @Column({
    type: DataType.CHAR(4),
    allowNull: true,
  })
  declare graduation_year: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Ethnicity)),
    defaultValue: Ethnicity.pnts,
    allowNull: false,
  })
  declare ethnicity: Ethnicity | null;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    defaultValue: Gender.pnts,
    allowNull: false,
  })
  declare gender: Gender | null;

  static async listUsers(): Promise<Pick<User, "id" | "email" | "full_name">[]> {
    throw new Error("Not implemented.");
  }
}
