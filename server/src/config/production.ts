import type { DeepPartial } from "@server/types/deep-partial"
import type { ConfigIn } from "./schema"

export default {
  "csrf": {
    options: {
      "cookieName": "__Host-psifi.x-csrf-token",
      "cookieOptions": {
        "secure": true,
      },
    },
  },
  "session": {
    "proxy": true,
    "cookie": { "secure": true },
  },
} satisfies DeepPartial<ConfigIn>
