import { DataType, Table, Column, Model, BelongsTo, ForeignKey, Sequelize } from "sequelize-typescript";

import { UserModel, UserRole } from "@server/common/models";

import Team from "./team";


type CreateUserPayload = Pick<UserModel, "email" | "hashed_password" | "password_salt" | "full_name" | "preferred_name">;

function isCreateUserPayload(something: any): something is CreateUserPayload {
  if (typeof something !== "object") return false;

  return [
    typeof something.email === "string",
    typeof something.full_name === "string",
    typeof something.preferred_name === "string",
    something.hashed_password instanceof Buffer,
    something.password_salt instanceof Buffer,
  ].every(v => v);
}

@Table
export default class User extends Model implements UserModel {
  @Column({
    field: "user_id",
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
    id!: number;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
    team_id?: number;

  @BelongsTo(() => Team)
    team?: Team;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
    email!: string;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
    hashed_password?: Buffer;

  @Column({
    type: DataType.BLOB("tiny"),
    allowNull: true,
  })
    password_salt?: Buffer;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.hacker,
    allowNull: false,
  })
    role!: UserRole;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    verify_code?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
    verify_sent_at?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
    initially_logged_in_at?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
    last_logged_in_at?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
    h_UK_marketing?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
    h_UK_Consent?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
    checked_in!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    discord_id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    discord_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    full_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    preferred_name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
    age?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    phone_number?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    university?: string;

  @Column({
    type: DataType.CHAR(4),
    allowNull: true,
  })
    graduation_year?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    ethnicity?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    gender?: string;
}
