import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { ValidationError as SequelizeValidationError } from "sequelize";
import { readFileSync } from "fs";
import { v4 as uuid } from "uuid";
import path from "path";

import { NullError, ValueError } from "@server/common/errors";
import QRCode from "@server/database/qr_code";

const presets = JSON.parse(readFileSync(path.join(__dirname, './QR_presets.json')).toString());

const qr_attributes = QRCode.getAttributes();

const allowed_create_fields = new Set(Object.keys(qr_attributes));
allowed_create_fields.delete("createdAt");
allowed_create_fields.delete("updatedAt");

const patch_fields = new Set(["state"]);

async function handleQRCreation(request: Request, response: Response) {
  const invalid_fields = Object.keys(request.body).filter((key) => !allowed_create_fields.has(key));
  if (invalid_fields.length > 0) {
    throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
  }

  request.body.payload = uuid();

  let new_instance;
  try {
    new_instance = await QRCode.create(request.body);
  } catch (error) {
    if (error instanceof SequelizeValidationError) {
      throw new createHttpError.BadRequest(error.message);
    }
    throw error;
  }

  response.status(200);
  response.json({ status: response.statusCode, message: "OK", data: new_instance });
}

export async function getQRCodeList(request: Request, response: Response): Promise<void> {
  const result = await QRCode.findAll({
    attributes: ["id", "name"]
  });
  response.status(200);
  response.json({
    status: 200,
    message: "OK",
    codes: result,
  });
}

export async function createQRCode(request: Request, response: Response, next: NextFunction): Promise<void> {
  if (!response.locals.isAdminRequest && !response.locals.isVolunteerRequest) {
    return next();
  }
  await handleQRCreation(request, response);
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

export async function getPresets(request: Request, response: Response): Promise<void> {
  response.status(200);
  response.json({
    status: 200,
    message: "OK", presets
  });
}

export async function usePreset(request: Request, response: Response, next: NextFunction): Promise<void> {
  const { isAdminRequest, isVolunteerRequest, isSponsorRequest } = response.locals;
  if (!isAdminRequest && !isVolunteerRequest && !isSponsorRequest) {
    return next();
  }
  const presetName = request.params.preset;
  if (!presetName || !presets.hasOwnProperty(presetName)) {
    throw new createHttpError.BadRequest();
  }
  const preset = presets[presetName];
  let expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + preset.minutesValid);
  request.body = {
    name: preset.name,
    points_value: preset.points,
    max_uses: preset.uses,
    category: "preset",
    state: true,
    creator_id: request.user!.id,
    start_time: new Date(),
    expiry_time: expiry,
  };
  await handleQRCreation(request, response);
}
