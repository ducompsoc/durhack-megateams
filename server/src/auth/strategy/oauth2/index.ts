import passport from "passport"
import type { VerifyCallback } from "passport-oauth2"
import refresh from "passport-oauth2-refresh"

import KeycloakOAuth2Strategy, { type KeycloakProfile } from "@server/auth/strategy/oauth2/strategy"
import { prisma, type User } from "@server/database"
import { passportOauth2Config } from "@server/config";

/**
 * Verify function for Passport.js 'oauth2' strategy (OAuth2 flow via DurHack Live)
 *
 * @param accessToken - OAuth2 access token (used for Bearer authentication)
 * @param refreshToken - OAuth2 refresh token (used to get a new access token when the old one has expired)
 * @param profile - profile obtained from OAuth2 provider by HTTP request
 * @param done - callback function to call with (error, user) when user is found or error encountered
 */
async function oauth2VerifyFunction(
  accessToken: string,
  refreshToken: string,
  profile: KeycloakProfile,
  done: VerifyCallback,
) {
  const timestamp = new Date()

  let user: User | undefined
  try {
    user = await prisma.user.upsert({
      where: {
        keycloakUserId: profile.sub,
      },
      update: {
        lastLoginTime: timestamp,
      },
      create: {
        keycloakUserId: profile.sub,
        initialLoginTime: timestamp,
        lastLoginTime: timestamp,
      }
    })
  } catch (error) {
    return done(error)
  }

  return done(null, user)
}

const oauth2_strategy = new KeycloakOAuth2Strategy(passportOauth2Config, oauth2VerifyFunction)

passport.use("oauth2", oauth2_strategy)
refresh.use("oauth2", oauth2_strategy)
