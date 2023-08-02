import createHttpError from "http-errors";
import { Request, Response } from "express";

import { NullError } from "@server/common/errors";
import QRCode from "@server/database/qr_code";


export async function getQRCodeList(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function createQRCode(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function getQRCodeDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function patchQRCodeDetails(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}

export async function deleteQRCode(request: Request, response: Response): Promise<void> {
  throw new createHttpError.NotImplemented();
}
