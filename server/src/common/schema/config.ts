import { z } from "zod";

export const listen_options_schema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
});

export const passport_local_options_schema = z.object({
  usernameField: z.string().optional(),
  passwordField: z.string().optional(),
  session: z.boolean().optional(),
  passReqToCallback: z.boolean().optional(),
});

export const oauth2_client_options_schema = z.object({
  authorizationURL: z.string().url(),
  tokenURL: z.string().url(),
  clientID: z.string(),
  clientSecret: z.string(),
  callbackURL: z.string().url(),
  profileURL: z.string().url(),
  state: z.boolean(),
  scope: z.string().or(z.string().array()).optional(),
  pkce: z.boolean(),
});

export const mysql_options_schema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
  database: z.string(),
  user: z.string(),
  password: z.string(),
});

export const sequelize_options_schema = mysql_options_schema.extend({
  dialect: z.string().default("mysql"),
}).transform((options) => ({
  host: options.host,
  port: options.port,
  database: options.database,
  username: options.user,
  password: options.password,
  dialect: options.dialect,
}));

export const cookie_options_schema = z.object({
  sameSite: z.union([z.literal("none"), z.literal("lax"), z.literal("strict")]).optional(),
  path: z.string().optional(),
  secure: z.boolean(),
});

export const double_csrf_options_schema = z.object({
  cookieName: z.string(),
  cookieOptions: cookie_options_schema,
});

export const session_options_schema = z.object({
  name: z.string(),
  secret: z.string(),
  resave: z.boolean().optional(),
  saveUninitialized: z.boolean().optional(),
  cookie: cookie_options_schema,
});

export const qr_preset_schema = z.object({
  name: z.string(),
  description: z.string(),
  points: z.number().nonnegative(),
  uses: z.number().nonnegative(),
  minutesValid: z.number().nonnegative(),
});

export const discord_options_schema = z.object({
  apiEndpoint: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
  botToken: z.string(),
  guildID: z.string(),
  inviteLink: z.string(),
  teamsParentChannel: z.string(),
});

export const config_schema = z.object({
  listen: listen_options_schema,
  flags: z.object({}),
  passport: z.object({
    local: passport_local_options_schema,
    oauth2: oauth2_client_options_schema,
  }),
  mysql: z.object({
    data: mysql_options_schema,
    session: mysql_options_schema,
  }),
  csrf: z.object({
    enabled: z.boolean(),
    secret: z.string(),
    options: double_csrf_options_schema,
  }),
  "cookie-parser": z.object({
    secret: z.string(),
  }),
  session: session_options_schema,
  megateams: z.object({
    maxTeamMembers: z.number().positive(),
    QRCodeRedemptionURL: z.string().url(),
    QRPresets: z.object({}).catchall(qr_preset_schema),
  }),
  discord: discord_options_schema,
});