import session from "@otterhttp/session"

import { signCookie, unsignCookieOrThrow } from "@server/auth/cookies"

import { sessionConfig } from "@server/config"

const { cookie: cookieOptions, ...sessionOptions } = sessionConfig

export type DurHackSessionRecord = Record<string, unknown> & {
  userId?: string | undefined
  keycloakOAuth2FlowCodeVerifier?: string | undefined
  redirectTo?: string | undefined
  generatedTeamName?: string | undefined
  csrfTokenInitialized?: boolean | undefined
}

export const getSession = session<DurHackSessionRecord>({
  store: undefined,
  ...sessionOptions,
  cookie: {
    ...cookieOptions,
    sign: signCookie,
    unsign: unsignCookieOrThrow,
  },
})
