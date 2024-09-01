import { Request as OtterRequest } from "@otterhttp/app"
import type { User } from "@server/database"

export class Request extends OtterRequest {
  user?: User

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
