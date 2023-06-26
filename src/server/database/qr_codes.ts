import {RowDataPacket} from "mysql2";
import { QRCodeModel } from "@/server/common/models";
import User from "@/server/database/users";
import database from "@/server/database";

interface qrcodeIdentifier {
  id: number,
  name: string,
}

export default class QRCode implements QRCodeModel {
  creator: User;
  description?: string;
  expiry_time: Date;
  id: number;
  name: string;
  payload: string;
  points_value: number;
  start_time: Date;
  state: boolean;

  constructor(row: RowDataPacket) {
    throw new Error("Not implemented.");
  }

  static async listQRCodes(): Promise<qrcodeIdentifier[]> {
    throw new Error("Not implemented.");
  }

  static async getQRCode(id: number): Promise<QRCodeModel> {
    throw new Error("Not implemented.");
  }
}
