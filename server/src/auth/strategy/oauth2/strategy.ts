import OAuth2Strategy from "passport-oauth2"
import fetch, { Response } from "node-fetch"
import { z } from "zod"
import config from "config"
import createHttpError from "http-errors"

import { UserRole } from "@server/common/model_enums"

const DurHackLiveProfileSchema = z.object({
  email: z.string(),
  role: z.nativeEnum(UserRole),
  preferred_name: z.string(),
})

export type DurHackLiveProfile = z.infer<typeof DurHackLiveProfileSchema>

const profile_url = z.string().url().parse(config.get("passport.oauth2.profileURL"))

export default class DurHackLiveOAuth2Strategy extends OAuth2Strategy {
  async userProfile(
    accessToken: string,
    done: (err?: Error | null, profile?: DurHackLiveProfile) => void,
  ): Promise<void> {
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
      return done(new createHttpError.BadGateway("Couldn't fetch user profile from DurHack Live."))
    }

    try {
      const profileJSON: any = await profileResponse.json()
      const profile = DurHackLiveProfileSchema.parse(profileJSON?.data)
      return done(null, profile)
    } catch (error) {
      return done(new createHttpError.BadGateway("Couldn't fetch user profile from DurHack Live."))
    }
  }
}
