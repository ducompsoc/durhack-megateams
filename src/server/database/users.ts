import { UserModel, UserRole } from "@/server/common/models";
import database from "./";

interface userIdentifier {
  id: number,
  full_name: string,
}

export default class User implements UserModel {
  checked_in: boolean;
  created_at: Date;
  email: string;
  full_name: string;
  id: number;
  preferred_name: string;
  role: keyof typeof UserRole;
  updated_at: Date;

  constructor() {
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
