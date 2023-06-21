import { QRCode } from "@/server/common/models";
import database from "./";

interface qrcodeIdentifier {
  id: number,
  name: string,
}

export function listQRCodes(): qrcodeIdentifier[] {
  throw new Error("Not implemented.");
}

export function getQRCode(id: number): QRCode {
  throw new Error("Not implemented.");
}