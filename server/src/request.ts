import { Request as OtterRequest } from "@otterhttp/app"
import type { Prisma } from "@prisma/client"
import type { TokenSet as ClientTokenSet } from "openid-client"

export class Request extends OtterRequest {
  user?: Prisma.UserGetPayload<{ include: { tokenSet: true } }>
  userTokenSet?: ClientTokenSet

  get origin() {
    return `${this.protocol}://${this.host}`
  }

  get host() {
    if (this.port) return `${this.hostname}:${this.port}`
    return this.hostname
  }

  get href() {
    return `${this.origin}${this.url}`
  }
}
