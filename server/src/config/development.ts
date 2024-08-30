import type { DeepPartial } from "@server/types/deep-partial"
import type { ConfigIn } from "./schema"

export default {
  "passport": {
    "oauth2": {
      "callbackURL": "http://localhost:8090/api/auth/login/callback",
    }
  },
  "megateams": {
    "QRCodeRedemptionURL": "http://localhost:8080/hacker/redeem",
  },
} satisfies DeepPartial<ConfigIn>
