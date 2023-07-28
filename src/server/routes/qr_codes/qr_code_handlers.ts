import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@server/common/errors";
import QRCode from "@server/database/qr_code";


export async function getQrCodeList(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function createQrCode(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function getQrCodeDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function patchQrCodeDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function deleteQrCode(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}