import { PHASE_DEVELOPMENT_SERVER } from "next/constants"

export const siteConfig = {
  name: "DurHack Guilds",
  description:
    "DurHack is an annual hackathon event hosted by Durham University Computing Society (compsoc.tech), which is a student society affiliated with Durham Students' Union.",
  openGraphImage: "/opengraph-image.png",
  url: "https://guilds.durhack.com",
  themeColor: "#b3824b",
}

if (PHASE_DEVELOPMENT_SERVER) {
  Object.assign(siteConfig, {
    url: "http://guilds.durhack-dev.com",
  })
}
