import { Router as ExpressRouter } from "express";

import handlers from "./qr_code_handlers";
import {
  handleFailedAuthentication,
  handleMethodNotAllowed,
  parseRouteId,
} from "@server/common/middleware";

const qr_codes_router = ExpressRouter();

qr_codes_router.route("/")
  .get(handlers.getQRCodeList, handlers.getPublicQRCodeList)
  .post(handlers.createQRCode, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

qr_codes_router.route("/preset")
  .get(
    handlers.getPresetsAdmin,
    handlers.getPresetsVolunteer,
    handlers.getPresetsSponsor,
    handleFailedAuthentication
  )
  .all(handleMethodNotAllowed);

qr_codes_router.route("/preset/:preset")
  .post(
    handlers.usePresetAdmin,
    handlers.usePresetVolunteer,
    handlers.usePresetSponsor,
    handleFailedAuthentication
  )
  .all(handleMethodNotAllowed);

qr_codes_router.route("/redeem")
  .post(handlers.redeemQR)
  .all(handleMethodNotAllowed);

qr_codes_router.route("/challenges")
  .get(
    handlers.getChallengeListAdmin,
    handlers.getChallengeListUser,
    handleFailedAuthentication
  )
  .post(handlers.reorderChallengeList)
  .all(handleMethodNotAllowed);

qr_codes_router.route("/:qr_code_id")
  .all(parseRouteId("qr_code_id"))
  .patch(
    handlers.patchQRAdmin,
    handlers.patchQRVolunteer,
    handlers.patchQRSponsor,
    handleFailedAuthentication
  )
  .all(handleMethodNotAllowed);

export default qr_codes_router;
