import type { DeepPartial } from "@server/types/deep-partial"
import type { ConfigIn } from "./schema"

export default {
  megateams: {
    QRCodeRedemptionURL: "http://localhost:8080/hacker/redeem",
  },
  keycloak: {
    redirectUris: ["http://localhost:3101/api/auth/keycloak/callback"],
  },
} satisfies DeepPartial<ConfigIn>
