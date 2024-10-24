import { TokenType } from "@durhack/token-vault/lib"
import type { ConfigIn } from "./schema"

export default {
  listen: {
    host: "localhost",
    port: 3101, // Megateams project has ports 3100-3199
  },
  origin: "http://megateams.durhack-dev.com",
  flags: {},
  csrf: {
    enabled: true,
    secret: "csrfisoverrated",
    options: {
      cookieOptions: {
        name: "durhack-megateams.x-csrf-token",
        domain: "megateams.durhack-dev.com",
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
      domain: "megateams.durhack-dev.com",
      sameSite: "lax",
      path: "/",
      secure: false,
    },
  },
  megateams: {
    maxTeamMembers: 4,
  },
  discord: {
    apiEndpoint: "https://discord.com/api/v10",
    clientId: "yourDiscordAppClientIdHere",
    clientSecret: "yourDiscordAppClientSecretHere",
    redirectUri: "http://megateams.durhack-dev.com/api/discord/redirect",
    botToken: "yourDiscordBotTokenHere",
    guildID: "yourDiscordGuildIDHere",
    inviteLink: "https://discord.gg/xyz",
    teamsParentChannel: "yourTeamsParentChannelIdHere",
  },
  jsonwebtoken: {
    accessTokenLifetime: 1800,
    refreshTokenLifetime: 1209600,
    issuer: "http://megateams.durhack-dev.com",
    audience: "http://megateams.durhack-dev.com",
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
    realm: "durhack-dev",
    baseUrl: "https://auth.durhack.com",
    adminBaseUrl: "https://admin.auth.durhack.com",
    clientId: "not-a-real-client-id",
    clientSecret: "not-a-real-client-secret",
    responseTypes: ["code"],
    redirectUris: ["http://megateams.durhack-dev.com/api/auth/keycloak/callback"],
  },
} satisfies ConfigIn
