import type { DeepPartial } from "@server/types/deep-partial"
import type { ConfigIn } from "./schema"

export default {
  "csrf": {
    options: {
      "cookieOptions": {
        name: "__Host-durhack-megateams.x-csrf-token",
        "secure": true,
      },
    },
  },
  "session": {
    "cookie": { "secure": true },
  },
} satisfies DeepPartial<ConfigIn>
