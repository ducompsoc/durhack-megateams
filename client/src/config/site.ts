import * as process from "node:process"

export const siteConfig = {
  url: "https://megateams.durhack.com",
}

if (process.env.NODE_ENV === "development") {
  Object.assign(siteConfig, {
    url: "http://megateams.durhack.com",
  })
}
