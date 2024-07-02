import { Router as ExpressRouter } from "express"
import QRHandlers from "./qr_code_handlers"
import { handleFailedAuthentication, handleMethodNotAllowed, parseRouteId } from "@server/common/middleware"

const qr_codes_router = ExpressRouter()
const handlers = new QRHandlers()

qr_codes_router
  .route("/")
  .get(handlers.getQRCodeList.bind(handlers), handleFailedAuthentication)
  .post(handlers.createQRCode.bind(handlers), handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qr_codes_router
  .route("/presets")
  .get(handlers.getPresetsList, handleFailedAuthentication)
  .post(handlers.createPreset, handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qr_codes_router
  .route("/presets/:preset_id")
  .get(handlers.getPresetDetails, handleFailedAuthentication)
  .post(handlers.usePreset.bind(handlers), handleFailedAuthentication)
  .delete(handlers.deletePreset, handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qr_codes_router.route("/redeem").post(handlers.redeemQR).all(handleMethodNotAllowed)

qr_codes_router
  .route("/challenges/reorder")
  .post(handlers.reorderChallengeList, handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qr_codes_router
  .route("/challenges")
  .get(
    handlers.getChallengeListAdmin.bind(handlers),
    handlers.getChallengeListAsAnonymous.bind(handlers),
    handleFailedAuthentication,
  )
  .post(handlers.createChallenge, handleFailedAuthentication)
  .all(handleMethodNotAllowed)

qr_codes_router
  .route("/:qr_code_id")
  .all(parseRouteId("qr_code_id"))
  .get(handlers.getQRCodeDetails, handleFailedAuthentication)
  .patch(handlers.patchQRCodeDetails.bind(handlers), handleFailedAuthentication)
  .delete(handlers.deleteQRCode, handleFailedAuthentication)
  .all(handleMethodNotAllowed)

export default qr_codes_router
