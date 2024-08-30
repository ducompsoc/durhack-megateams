import { Router as ExpressRouter } from "express"

import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

import { qrCodesHandlers } from "./qr-codes-handlers"

export const qrCodesRouter = ExpressRouter()

qrCodesRouter
  .route("/")
  .get(qrCodesHandlers.getQRCodeList(), handleFailedAuthentication)
  .post(qrCodesHandlers.createQRCode(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qrCodesRouter
  .route("/presets")
  .get(qrCodesHandlers.getPresetsList(), handleFailedAuthentication)
  .post(qrCodesHandlers.createPreset(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qrCodesRouter
  .route("/presets/:preset_id")
  .get(qrCodesHandlers.getPresetDetails(), handleFailedAuthentication)
  .post(qrCodesHandlers.usePreset(), handleFailedAuthentication)
  .delete(qrCodesHandlers.deletePreset(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qrCodesRouter.route("/redeem")
  .post(qrCodesHandlers.redeemQR())
  .all(handleMethodNotAllowed)

qrCodesRouter
  .route("/challenges/reorder")
  .post(qrCodesHandlers.reorderChallengeList(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qrCodesRouter
  .route("/challenges")
  .get(qrCodesHandlers.getChallengeListAdmin(), qrCodesHandlers.getChallengeListAsAnonymous(), handleFailedAuthentication)
  .post(qrCodesHandlers.createChallenge(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qrCodesRouter
  .route("/:qr_code_id")
  .all(parseRouteId("qr_code_id"))
  .get(qrCodesHandlers.getQRCodeDetails(), handleFailedAuthentication)
  .patch(qrCodesHandlers.patchQRCodeDetails(), handleFailedAuthentication)
  .delete(qrCodesHandlers.deleteQRCode(), handleFailedAuthentication)
  .all(handleMethodNotAllowed)
