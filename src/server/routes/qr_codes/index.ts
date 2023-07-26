import { Router as ExpressRouter } from "express";

import * as handlers from "./qr_code_handlers";
import { handleMethodNotAllowed } from "@server/common/middleware";


const qr_codes_router = ExpressRouter();

qr_codes_router.route("/")
  .get(handlers.getQrCodeList)
  .post(handlers.createQrCode)
  .all(handleMethodNotAllowed);

qr_codes_router.route("/:qr_code_id")
  .get(handlers.getQrCodeDetails)
  .patch(handlers.patchQrCodeDetails)
  .delete(handlers.deleteQrCode)
  .all(handleMethodNotAllowed);

export default qr_codes_router;