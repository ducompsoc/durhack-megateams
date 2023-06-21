import { RowDataPacket } from "mysql2";
import { MegateamModel } from "@/server/common/models";
import database from "@/server/database";

interface megateamIdentifier {
  id: number,
  name: string,
}

export default class Megateam implements MegateamModel {
  id: number;
  name: string;
  description?: string;

  constructor(row: RowDataPacket) {

  }

  static async listMegateams(): Promise<megateamIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getMegateam(id: number): Promise<MegateamModel> {
    throw new Error("Not implemented.");
  }
}
