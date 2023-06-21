import { RowDataPacket } from "mysql2";
import { TeamModel } from "@/server/common/models";
import Area from "@/server/database/areas";
import database from "@/server/database";

interface teamIdentifier {
  id: number,
  name: string,
}

export default class Team implements TeamModel {
  id: number;
  name: string;
  area?: Area;

  constructor(row: RowDataPacket) {

  }

  static async listTeams(): Promise<teamIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getTeam(id: number): Promise<TeamModel> {
    throw new Error("Not implemented.");
  }
}
