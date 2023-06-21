import { QRCodeModel } from "@/server/common/models";
import database from "./";

interface qrcodeIdentifier {
  id: number,
  name: string,
}

export function listQRCodes(): qrcodeIdentifier[] {
  throw new Error("Not implemented.");
}

export function getQRCode(id: number): QRCodeModel {
  throw new Error("Not implemented.");
}