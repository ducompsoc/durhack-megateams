import { RowDataPacket } from "mysql2";
import { UserIdentifierModel, UserModel, UserRole } from "@/server/common/models";
import Team from "@/server/database/teams";
import database from "@/server/database";
import {NullError, ValueError} from "../common/errors";

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

export default class User implements UserModel {
  id: number;
  team?: Team;
  email: string;
  hashed_password?: Buffer;
  password_salt?: Buffer;
  role: keyof typeof UserRole;
  verify_code?: string;
  verify_sent_at?: number;
  initially_logged_in_at?: Date;
  last_logged_in_at?: Date;
  h_UK_marketing?: boolean;
  h_UK_Consent?: boolean;
  checked_in: boolean;
  created_at: Date;
  updated_at: Date;

  discord_id?: string;
  discord_name?: string;
  full_name: string;
  preferred_name: string;
  age?: number;
  phone_number?: string;
  university?: string;
  graduation_year?: string;
  ethnicity?: string;
  gender?: string;

  constructor(row: RowDataPacket) {
    throw new Error("Not implemented.");
  }

  static async listUsers(): Promise<UserIdentifierModel[]> {
    throw new Error("Not implemented.");
  }

  static async getUser(id: number): Promise<User> {
    const query = "SELECT * FROM users WHERE id = ? AND role = `hacker`";
    const [rows] = await database.execute<RowDataPacket[]>(query, [id]);
    if (rows == undefined) throw new NullError();
    return new User(rows[0]);
    // throw new Error("Not implemented.");
  }

  static async findUserByEmail(email: string): Promise<User> {
    throw new Error("Not implemented.");
  }

  static async createNewUser(payload: CreateUserPayload): Promise<void> {
    if (!isCreateUserPayload(payload)) {
      throw new ValueError("Missing necessary fields.");
    }
    throw new Error("Not implemented.");
  }

  static async updateUserDetails(): Promise<void> {
    throw new Error("Not implemented.");
  }

  static async updateUserPassword(): Promise<void> {
    throw new Error("Not implemented.");
  }
}
