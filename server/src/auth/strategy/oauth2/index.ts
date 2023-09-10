import { VerifyCallback } from "passport-oauth2";
import config from "config";
import passport from "passport";

import DurHackLiveOAuth2Strategy, { DurHackLiveProfile } from "@server/auth/strategy/oauth2/strategy";
import { oauth2_client_options_schema } from "@server/common/schema/config";
import User from "@server/database/tables/user";


const oauth2_options = oauth2_client_options_schema.parse(config.get("passport.oauth2"));

/**
 * Verify function for Passport.js 'oauth2' strategy (OAuth2 flow via DurHack Live)
 *
 * @param accessToken - OAuth2 access token (used for Bearer authentication)
 * @param refreshToken -
 * @param profile -
 * @param done -
 */
async function oauth2VerifyFunction(accessToken: string, refreshToken: string, profile: DurHackLiveProfile, done: VerifyCallback) {

}

const oauth2_strategy = new DurHackLiveOAuth2Strategy(
  oauth2_options,
  oauth2VerifyFunction,
);

passport.use("oauth2", oauth2_strategy);
