import { TokenType } from "@durhack/token-vault/lib"
import type { ConfigIn } from "./schema"

export default {
  listen: {
    host: "localhost",
    port: 3101,
  },
  hostname: "http://localhost:3101",
  flags: {},
  csrf: {
    enabled: true,
    secret: "csrfisoverrated",
    options: {
      cookieOptions: {
        name: "durhack-megateams.x-csrf-token",
        sameSite: "strict",
        path: "/",
        secure: false,
      },
    },
  },
  cookieSigning: {
    secret: "thebestsecretforcookies",
  },
  session: {
    cookie: {
      name: "durhack-megateams-session",
      secure: false
    },
  },
  megateams: {
    maxTeamMembers: 4,
    QRCodeRedemptionURL: "https://megateams.durhack.com/hacker/redeem",
    QRPresets: {
      chat: {
        name: "Chat - 5p",
        description: "Speak to a sponsor for 5 points",
        points: 5,
        uses: 1,
        minutesValid: 2,
      },
      workshop: {
        name: "Workshop - 10p",
        description: "Attend a sponsor workshop for 10 points",
        points: 10,
        uses: 50,
        minutesValid: 10,
      },
    },
  },
  discord: {
    apiEndpoint: "https://discord.com/api/v10",
    clientId: "yourDiscordAppClientIdHere",
    clientSecret: "yourDiscordAppClientSecretHere",
    redirectUri: "https://megateams.durhack.com/api/discord/redirect",
    botToken: "yourDiscordBotTokenHere",
    guildID: "yourDiscordGuildIDHere",
    inviteLink: "https://discord.gg/xyz",
    teamsParentChannel: "yourTeamsParentChannelIdHere",
  },
  jsonwebtoken: {
    accessTokenLifetime: 1800,
    refreshTokenLifetime: 1209600,
    issuer: "https://megateams.durhack.com",
    audience: "https://megateams.durhack.com",
    authorities: [
      {
        for: TokenType.accessToken,
        algorithm: "hsa",
        secret: "totally-a-secure-SECRET",
      },
      {
        for: TokenType.refreshToken,
        algorithm: "hsa",
        secret: "an-even-more-secure-SECRET",
      },
      {
        for: TokenType.authorizationCode,
        algorithm: "hsa",
        secret: "the-MOST-secure-SECRET",
      },
    ],
  },
  keycloak: {
    url: "https://auth.durhack.com/realms/durhack",
    clientId: "not-a-real-client-id",
    clientSecret: "not-a-real-client-secret",
    responseTypes: ["code"],
    redirectUris: ["https://live.durhack.com/api/auth/keycloak/callback"],
  }
} satisfies ConfigIn
