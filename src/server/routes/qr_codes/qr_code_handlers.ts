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
import { Op } from "sequelize";
import sequelize from "@server/database";
import { z } from "zod";

const presets = JSON.parse(
  readFileSync(path.join(__dirname, "./QR_presets.json")).toString()
);

const qr_attributes = QRCode.getAttributes();

const allowed_create_fields = new Set(Object.keys(qr_attributes));
allowed_create_fields.delete("createdAt");
allowed_create_fields.delete("updatedAt");
allowed_create_fields.delete("payload");
allowed_create_fields.delete("creator_id");
allowed_create_fields.add("publicised");

const patch_fields = new Set(["state", "publicised"]);

class QRHandlers {
  constructor() {
    Object.getOwnPropertyNames(QRHandlers.prototype).forEach((key) => {
      if (key !== "constructor") {
        // @ts-ignore
        this[key] = this[key].bind(this);
      }
    });
  }

  private async handleQRCreation(request: Request, response: Response) {
    const invalid_fields = Object.keys(request.body).filter(
      (key) => !allowed_create_fields.has(key)
    );
    if (invalid_fields.length > 0) {
      throw new ValueError(`Invalid field name(s) provided: ${invalid_fields}`);
    }

    request.body.payload = uuid();
    request.body.creator_id = request.user?.id;

    const publicisedFields = await this.getPublicisedFields(
      undefined,
      request.body.publicised
    );

    let new_instance = await QRCode.create({
      ...request.body,
      ...publicisedFields,
    });

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
    const name = request.body.name;
    if (!presetName || !presets.hasOwnProperty(presetName) || !name) {
      throw new createHttpError.BadRequest();
    }
    const preset = presets[presetName];
    let expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + preset.minutesValid);
    request.body = {
      name: name,
      points_value: preset.points,
      max_uses: preset.uses,
      category: "preset",
      state: true,
      start_time: new Date(),
      expiry_time: expiry,
      publicised: request.body.publicised,
    };
    await this.handleQRCreation(request, response);
  }

  @requireUserIsAdmin
  async usePresetAdmin(request: Request, response: Response) {
    await this.handlePresetCreation(request, response);
  }

  @requireUserIsSponsor
  async usePresetSponsor(request: Request, response: Response) {
    await this.handlePresetCreation(request, response);
  }

  @requireUserIsVolunteer
  async usePresetVolunteer(request: Request, response: Response) {
    await this.handlePresetCreation(request, response);
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

  private async getPublicisedFields(
    existing_rank: number | undefined,
    publicised: boolean
  ) {
    let fields = { challenge_rank: existing_rank };

    if (!publicised) {
      fields.challenge_rank = undefined;
    } else {
      if (!existing_rank) {
        let maxRank: number = await QRCode.max("challenge_rank");
        if (maxRank) {
          fields.challenge_rank = maxRank + 1;
        } else {
          fields.challenge_rank = 0;
        }
      }
    }

    return fields;
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

    let fields;

    if (request.body.hasOwnProperty("publicised")) {
      fields = await this.getPublicisedFields(
        found_code.challenge_rank,
        request.body.publicised
      );
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
  async patchQRAdmin(request: Request, response: Response) {
    await this.patchQRCodeDetails(request, response);
  }

  @requireUserIsSponsor
  async patchQRSponsor(request: Request, response: Response) {
    await this.patchQRCodeDetails(request, response);
  }

  @requireUserIsVolunteer
  async patchQRVolunteer(request: Request, response: Response) {
    await this.patchQRCodeDetails(request, response);
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
  getPresetsAdmin(request: Request, response: Response) {
    this.getPresets(request, response);
  }

  @requireUserIsVolunteer
  getPresetsVolunteer(request: Request, response: Response) {
    this.getPresets(request, response);
  }

  @requireUserIsSponsor
  getPresetsSponsor(request: Request, response: Response) {
    this.getPresets(request, response);
  }

  async redeemQR(request: Request, response: Response) {
    if (!request.body.hasOwnProperty("uuid")) {
      throw new createHttpError.BadRequest();
    }

    let qr = await QRCode.findOne({
      where: { payload: request.body.uuid },
      include: [Point],
      rejectOnEmpty: new createHttpError.BadRequest(),
    });

    let now = new Date();
    if (
      now < qr.start_time ||
      now > qr.expiry_time ||
      !qr.state ||
      (qr.uses?.length || 0) >= qr.max_uses
    ) {
      throw new createHttpError.BadRequest();
    }

    await Point.create({
      value: qr.points_value,
      origin_qrcode_id: qr.id,
      redeemer_id: request.user?.id,
    });

    response.json({
      status: 200,
      message: "OK",
      points: qr.points_value,
    });
  }

  private async getChallengeList(
    _request: Request,
    response: Response,
    includeId: boolean
  ) {
    const now = new Date();
    let challenges = await QRCode.findAll({
      where: {
        challenge_rank: { [Op.ne]: null },
        state: true,
        start_time: { [Op.lt]: now },
        expiry_time: { [Op.gt]: now },
      },
    });

    challenges.sort((a, b) => a.challenge_rank! - b.challenge_rank!);

    let data = challenges.map((challenge, i) => ({
      title: challenge.name,
      points: challenge.points_value,
      rank: i,
      ...(includeId ? { id: challenge.id } : {}),
    }));

    response.json({
      status: 200,
      message: "OK",
      challenges: data,
    });
  }

  @requireUserIsAdmin
  async getChallengeListAdmin(request: Request, response: Response) {
    await this.getChallengeList(request, response, true);
  }

  async getChallengeListUser(request: Request, response: Response) {
    await this.getChallengeList(request, response, false);
  }

  @requireUserIsAdmin
  async reorderChallengeList(request: Request, response: Response) {
    const challengeList = z.array(
      z.object({
        id: z.number(),
        rank: z.number(),
      })
    );

    if (
      !request.body.hasOwnProperty("challenges") ||
      !challengeList.safeParse(request.body.challenges).success
    ) {
      throw new createHttpError.BadRequest();
    }

    const t = await sequelize.transaction();

    try {
      await QRCode.update(
        { challenge_rank: null },
        { where: { challenge_rank: { [Op.ne]: null } } }
      );

      for (let challenge of request.body.challenges) {
        let found_challenge = await QRCode.findByPk(challenge.id, {
          rejectOnEmpty: new NullError(),
        });
        found_challenge.challenge_rank = challenge.rank;
        await found_challenge.save();
      }

      await t.commit();

      response.json({
        status: 200,
        message: "OK",
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

const handlersInstance = new QRHandlers();
export default handlersInstance;
