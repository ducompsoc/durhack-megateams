import OAuth2Strategy from "passport-oauth2"
import { z } from "zod"
import createHttpError from "http-errors"

import { passportOauth2Config } from "@server/config";
import { UserRole } from "@server/common/model-enums"

const KeycloakProfileSchema = z.object({
  sub: z.string().uuid(),
  email: z.string(),
  preferred_name: z.string(),
  role: z.nativeEnum(UserRole),
})

export type KeycloakProfile = z.infer<typeof KeycloakProfileSchema>

const profile_url = passportOauth2Config.profileURL

export default class KeycloakOAuth2Strategy extends OAuth2Strategy {
  async userProfile(accessToken: string, done: (err?: unknown | null, profile?: KeycloakProfile) => void) {
    let profileResponse: Response
    try {
      profileResponse = await fetch(profile_url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      return done(error)
    }

    if (!profileResponse.ok) {
      return done(new createHttpError.BadGateway("Couldn't fetch user profile from DurHack Login."))
    }

    try {
      const profileJSON = await profileResponse.json()
      const profile = KeycloakProfileSchema.parse({
        ...profileJSON,
        role: this.getRole(profileJSON),
      })
      return done(null, profile)
    } catch (error) {
      return done(new createHttpError.BadGateway("Invalid user profile received from DurHack Login."))
    }
  }

  getRole(json: { realm_access?: { roles?: string[] }}) {
    for (const role of Object.values(UserRole)) {
      if (json.realm_access?.roles?.includes(role)) return role
    }
  }
}
