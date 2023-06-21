import { RowDataPacket } from "mysql2";
import { UserModel, UserRole } from "@/server/common/models";
import Team from "@/server/database/teams";
import database from "@/server/database";

interface userIdentifier {
  id: number,
  full_name: string,
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

  }

  static async listUsers(): Promise<userIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getUser(id: number): Promise<User> {
    throw new Error("Not implemented.");
  }

  static async findUserByEmail(email: string): Promise<User> {
    throw new Error("Not implemented.");
  }

  static async createNewUser(): Promise<void> {
    throw new Error("Not implemented.");
  }

  static async updateUserDetails(): Promise<void> {
    throw new Error("Not implemented.");
  }

  static async updateUserPassword(): Promise<void> {
    throw new Error("Not implemented.");
  }
}
