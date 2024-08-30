import OAuth2Strategy from "passport-oauth2"
import fetch, { Response } from "node-fetch"
import { z } from "zod"
import config from "config"
import createHttpError from "http-errors"

import { UserRole } from "@server/common/model-enums"

const KeycloakProfileSchema = z.object({
  email: z.string(),
  preferred_name: z.string(),
  role: z.nativeEnum(UserRole),
})

export type KeycloakProfile = z.infer<typeof KeycloakProfileSchema>

const profile_url = z.string().url().parse(config.get("passport.oauth2.profileURL"))

export default class KeycloakOAuth2Strategy extends OAuth2Strategy {
  async userProfile(accessToken: string, done: (err?: Error | null, profile?: KeycloakProfile) => void) {
    let profileResponse: Response
    try {
      profileResponse = await fetch(profile_url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error: any) {
      return done(error)
    }

    if (!profileResponse.ok) {
      return done(new createHttpError.BadGateway("Couldn't fetch user profile from DurHack Login."))
    }

    try {
      const profileJSON: any = this.mapProfileRoles(await profileResponse.json())
      const profile = KeycloakProfileSchema.parse(profileJSON)
      return done(null, profile)
    } catch (error) {
      return done(new createHttpError.BadGateway("Invalid user profile received from DurHack Login."))
    }
  }

  mapProfileRoles(json: any) {
    for (let role of Object.values(UserRole)) {
      if (json.realm_access?.roles?.includes(role)) json.role = role
    }
    return json
  }
}
