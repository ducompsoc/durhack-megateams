import config from "config";
import passport from "passport";
import { VerifyCallback } from "passport-oauth2";
import refresh from "passport-oauth2-refresh";

import DurHackLiveOAuth2Strategy, { DurHackLiveProfile } from "@server/auth/strategy/oauth2/strategy";
import { oauth2_client_options_schema } from "@server/common/schema/config";
import User from "@server/database/tables/user";


const oauth2_options = oauth2_client_options_schema.parse(config.get("passport.oauth2"));

/**
 * Verify function for Passport.js 'oauth2' strategy (OAuth2 flow via DurHack Live)
 *
 * @param accessToken - OAuth2 access token (used for Bearer authentication)
 * @param refreshToken - OAuth2 refresh token (used to get a new access token when the old one has expired)
 * @param profile - profile obtained from OAuth2 provider by HTTP request
 * @param done - callback function to call with (error, user) when user is found or error encountered
 */
async function oauth2VerifyFunction(accessToken: string, refreshToken: string, profile: DurHackLiveProfile, done: VerifyCallback) {
  const timestamp = new Date();

  let user: User;
  let _is_new: boolean;
  try {
    [user, _is_new] = await User.findOrCreate(
      {
        where: { email: profile.email },
        defaults: {
          ...profile,
          initially_logged_in_at: timestamp,
        }
      },
    );
  } catch (error) {
    return done(error);
  }

  await user.update({
    ...profile,
    last_logged_in_at: timestamp,
  });

  return done(null, user);
}

const oauth2_strategy = new DurHackLiveOAuth2Strategy(
  oauth2_options,
  oauth2VerifyFunction,
);

passport.use("oauth2", oauth2_strategy);
refresh.use("oauth2", oauth2_strategy);
