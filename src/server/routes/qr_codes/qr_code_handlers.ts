import createHttpError from "http-errors";
import { Request, Response } from "express";
import { readFileSync } from "fs";
import { v4 as uuid } from "uuid";
import path from "path";
import { NullError, ValueError } from "@server/common/errors";
import QRCode from "@server/database/qr_code";
import Point from "@server/database/point";
import User from "@server/database/user";
import {
  requireUserIsAdmin,
  requireUserIsVolunteer,
  requireUserIsSponsor,
} from "@server/common/decorators";

const presets = JSON.parse(
  readFileSync(path.join(__dirname, "./QR_presets.json")).toString()
);

const qr_attributes = QRCode.getAttributes();

const allowed_create_fields = new Set(Object.keys(qr_attributes));
allowed_create_fields.delete("createdAt");
allowed_create_fields.delete("updatedAt");
allowed_create_fields.delete("payload");
allowed_create_fields.delete("creator_id");

const patch_fields = new Set(["state", "publicised"]);

class QRHandlers {
  private async handleQRCreation(request: Request, response: Response) {
    const invalid_fields = Object.keys(request.body).filter(
      (key) => !allowed_create_fields.has(key)
    );
    if (invalid_fields.length > 0) {
      throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
    }

    request.body.payload = uuid();
    request.body.creator_id = request.user?.id;

    let new_instance = await QRCode.create(request.body);

    response.status(200);
    response.json({
      status: response.statusCode,
      message: "OK",
      data: new_instance,
    });
  }

  @requireUserIsAdmin
  async createQRCode(request: Request, response: Response): Promise<void> {
    await this.handleQRCreation(request, response);
  }

  private async handlePresetCreation(request: Request, response: Response) {
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
      start_time: new Date(),
      expiry_time: expiry,
    };
    await this.handleQRCreation(request, response);
  }

  @requireUserIsAdmin
  usePresetAdmin(request: Request, response: Response) {
    this.handlePresetCreation(request, response);
  }

  @requireUserIsSponsor
  usePresetSponsor(request: Request, response: Response) {
    this.handlePresetCreation(request, response);
  }

  @requireUserIsVolunteer
  usePresetVolunteer(request: Request, response: Response) {
    this.handlePresetCreation(request, response);
  }

  @requireUserIsAdmin
  async getQRCodeList(_request: Request, response: Response): Promise<void> {
    const result = await QRCode.findAll({ include: [Point, User] });

    const payload = result.map((code: QRCode) => ({
      id: code.id,
      name: code.name,
      category: code.category,
      scans: code.uses?.length || 0,
      max_scans: code.max_uses,
      creator: code.creator.full_name,
      value: code.points_value,
      start: code.start_time,
      end: code.expiry_time,
      enabled: code.state,
      uuid: code.payload,
      publicised: code.challenge_rank ? true : false,
    }));

    response.status(200);
    response.json({
      status: 200,
      message: "OK",
      codes: payload,
    });
  }

  private async patchQRCodeDetails(
    request: Request,
    response: Response
  ): Promise<void> {
    const { qr_code_id } = response.locals;
    if (typeof qr_code_id !== "number")
      throw new Error("Parsed `qr_code_id` not found.");

    const invalid_fields = Object.keys(request.body).filter(
      (key) => !patch_fields.has(key)
    );
    if (invalid_fields.length > 0) {
      throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
    }

    const found_code = await QRCode.findByPk(qr_code_id, {
      rejectOnEmpty: new NullError(),
    });

    const fields = { challenge_rank: found_code.challenge_rank };

    if (request.body.hasOwnProperty("publicised")) {
      if (!request.body.publicised) {
        fields.challenge_rank = undefined;
      } else {
        if (!found_code.challenge_rank) {
          let maxRank: number = await QRCode.max("challenge_rank");
          if (maxRank) {
            fields.challenge_rank = maxRank + 1;
          } else {
            fields.challenge_rank = 1;
          }
        }
      }
    }

    await found_code.update({ state: request.body.state, ...fields });

    response.status(200);
    response.json({
      status: response.statusCode,
      message: "OK",
      data: found_code,
    });
  }

  @requireUserIsAdmin
  patchQRAdmin(request: Request, response: Response) {
    this.patchQRCodeDetails(request, response);
  }

  @requireUserIsSponsor
  patchQRSponsor(request: Request, response: Response) {
    this.patchQRCodeDetails(request, response);
  }

  @requireUserIsVolunteer
  patchQRVolunteer(request: Request, response: Response) {
    this.patchQRCodeDetails(request, response);
  }

  private getPresets(_request: Request, response: Response) {
    response.status(200);
    response.json({
      status: 200,
      message: "OK",
      presets,
    });
  }

  @requireUserIsAdmin
  async getPresetsAdmin(request: Request, response: Response) {
    this.getPresets(request, response);
  }

  @requireUserIsVolunteer
  async getPresetsVolunteer(request: Request, response: Response) {
    this.getPresets(request, response);
  }

  @requireUserIsSponsor
  async getPresetsSponsor(request: Request, response: Response) {
    this.getPresets(request, response);
  }
}

const handlersInstance = new QRHandlers();
export default handlersInstance;
