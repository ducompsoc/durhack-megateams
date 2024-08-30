import { TokenType } from "@durhack/token-vault/lib"
import type { ConfigIn } from "./schema"

export default {
  listen: {
    host: "127.0.0.1",
    port: 3101,
  },
  hostname: "http://localhost:3101",
  flags: {},
  passport: {
    local: {
      usernameField: "email",
      passwordField: "password",
      session: true,
      passReqToCallback: false,
    },
    oauth2: {
      authorizationURL: "https://auth.durhack.com/realms/durhack/protocol/openid-connect/auth",
      tokenURL: "https://auth.durhack.com/realms/durhack/protocol/openid-connect/token",
      callbackURL: "https://megateams.durhack.com/api/auth/login/callback",
      profileURL: "https://auth.durhack.com/realms/durhack/protocol/openid-connect/userinfo",
      clientID: "megateams",
      clientSecret: "this-is-not-a-real-client-secret",
      state: true,
      scope: ["openid", "email", "profile", "roles"],
      pkce: true,
    },
  },
  mysql: {
    data: {
      host: "127.0.0.1",
      port: 3306,
      database: "durhack",
      user: "root",
      password: "strongexamplepassword",
    },
    session: {
      host: "127.0.0.1",
      port: 3306,
      database: "durhack-session",
      user: "root",
      password: "strongexamplepassword",
    },
  },
  csrf: {
    enabled: true,
    secret: "csrfisoverrated",
    options: {
      cookieName: "psifi.x-csrf-token",
      cookieOptions: {
        sameSite: "strict",
        path: "/",
        secure: false,
      },
    },
  },
  "cookie-parser": {
    secret: "thebestsecretforcookies",
  },
  session: {
    name: "durhack-megateams-session",
    secret: "session_cookie_secret",
    resave: false,
    proxy: false,
    saveUninitialized: false,
    cookie: { secure: false },
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
