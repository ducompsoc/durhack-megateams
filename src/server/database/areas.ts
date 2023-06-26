import { RowDataPacket } from "mysql2";
import { AreaModel } from "@/server/common/models";
import Megateam from "@/server/database/megateams";
import database from "@/server/database";

interface areaIdentifier {
  id: number,
  name: string,
}

export default class Area implements AreaModel {
  id: number;
  megateam: Megateam;
  name: string;
  room: string;

  constructor(row: RowDataPacket) {
    throw new Error("Not implemented.");
  }

  static async listAreas(): Promise<areaIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getArea(id: number): Promise<AreaModel> {
    throw new Error("Not implemented.");
  }
}
