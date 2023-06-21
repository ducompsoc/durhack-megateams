import { RowDataPacket } from "mysql2";
import { PointModel } from "@/server/common/models";
import QRCode from "@/server/database/qr_codes";
import User from "@/server/database/users";
import database from "@/server/database";

export default class Point implements PointModel {
  id: number;
  qrcode: QRCode;
  redeemer: User;
  value: number;

  constructor(row: RowDataPacket) {

  }
}