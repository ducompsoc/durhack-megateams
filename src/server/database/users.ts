import { RowDataPacket } from "mysql2";
import { UserModel, UserRole } from "@/server/common/models";
import Team from "@/server/database/teams";
import database from "@/server/database";
import { NullError } from "../common/errors";

interface UserIdentifier {
  id: number,
  preferred_name: string,
}

interface PublicUser extends UserIdentifier {
  discord_id?: string,
  discord_name?: string,
  university?: string,
  graduation_year?: string,
  role: keyof typeof UserRole,
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
    // Required Stuff
    this.id = row.user_id;
    this.email = row.email;
    this.role = row.role;
    this.checked_in = row.checked_in;
    this.created_at = row.created_at;
    this.updated_at = row.updated_at;
    this.full_name = row.full_name;
    this.preferred_name = row.preferred_name;
    // throw new Error("Not implemented.");
  }

  getPublicUser(): PublicUser {
    const public_user: PublicUser = {
      id: this.id,
      preferred_name: this.preferred_name,
      discord_id: this.discord_id,
      discord_name: this.discord_name,
      university: this.university,
      graduation_year: this.graduation_year,
      role: this.role,
    };
    return public_user;
  }

  static async listUsers(): Promise<UserIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getUser(id: number): Promise<User> {
    const query = "SELECT * FROM users WHERE user_id = ? AND role = 'hacker'";
    const [rows] = await database.execute<RowDataPacket[]>(query, [id]);
    if (rows.length === 0) throw new NullError();
    return new User(rows[0]);
    // throw new Error("Not implemented.");
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
