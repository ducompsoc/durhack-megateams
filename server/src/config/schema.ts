import { tokenVaultOptionsSchema } from "@durhack/token-vault/config-schema"
import { z } from "zod"

export const listenOptionsSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
})

export const passportLocalOptionsSchema = z.object({
  usernameField: z.string().optional(),
  passwordField: z.string().optional(),
  session: z.boolean().optional(),
  passReqToCallback: z.boolean().optional(),
})

export const oauth2ClientOptionsSchema = z.object({
  authorizationURL: z.string().url(),
  tokenURL: z.string().url(),
  clientID: z.string(),
  clientSecret: z.string(),
  callbackURL: z.string().url(),
  profileURL: z.string().url(),
  state: z.boolean(),
  scope: z.string().or(z.string().array()).optional(),
  pkce: z.boolean(),
})

export const mysqlOptionsSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
  database: z.string(),
  user: z.string(),
  password: z.string(),
})

export const sequelize_options_schema = mysqlOptionsSchema
  .extend({
    dialect: z.string().default("mysql"),
  })
  .transform(options => ({
    host: options.host,
    port: options.port,
    database: options.database,
    username: options.user,
    password: options.password,
    dialect: options.dialect,
  }))

export const cookie_options_schema = z.object({
  sameSite: z.union([z.literal("none"), z.literal("lax"), z.literal("strict")]).optional(),
  path: z.string().optional(),
  secure: z.boolean(),
})

export const doubleCsrfOptionsSchema = z.object({
  cookieName: z.string(),
  cookieOptions: cookie_options_schema,
})

export const sessionOptionsSchema = z.object({
  name: z.string(),
  proxy: z.boolean(),
  secret: z.string(),
  resave: z.boolean().optional(),
  saveUninitialized: z.boolean().optional(),
  cookie: cookie_options_schema,
})

export const qrPresetSchema = z.object({
  name: z.string(),
  description: z.string(),
  points: z.number().nonnegative(),
  uses: z.number().nonnegative(),
  minutesValid: z.number().nonnegative(),
})

export const keycloakOptionsSchema = z.object({
  url: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUris: z.array(z.string()),
  responseTypes: z.array(z.union([z.literal("code"), z.literal("token"), z.literal("id_token"), z.literal("none")])),
})

export const discordOptionsSchema = z.object({
  apiEndpoint: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
  botToken: z.string(),
  guildID: z.string(),
  inviteLink: z.string(),
  teamsParentChannel: z.string(),
})

export const configSchema = z.object({
  listen: listenOptionsSchema,
  hostname: z.string().url(),
  flags: z.object({}),
  passport: z.object({
    local: passportLocalOptionsSchema,
    oauth2: oauth2ClientOptionsSchema,
  }),
  mysql: z.object({
    data: mysqlOptionsSchema,
    session: mysqlOptionsSchema,
  }),
  csrf: z.object({
    enabled: z.boolean(),
    secret: z.string(),
    options: doubleCsrfOptionsSchema,
  }),
  "cookie-parser": z.object({
    secret: z.string(),
  }),
  jsonwebtoken: tokenVaultOptionsSchema,
  session: sessionOptionsSchema,
  megateams: z.object({
    maxTeamMembers: z.number().positive(),
    QRCodeRedemptionURL: z.string().url(),
    QRPresets: z.object({}).catchall(qrPresetSchema),
  }),
  discord: discordOptionsSchema,
  keycloak: keycloakOptionsSchema,
})

export type Config = z.infer<typeof configSchema>
export type ConfigIn = z.input<typeof configSchema>
