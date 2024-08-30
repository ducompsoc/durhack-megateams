import passport from "passport"

import { prisma, type User as PrismaUser } from "@server/database";

import "./strategy/oauth2"

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Express {
    interface User extends PrismaUser {}
  }
}

interface SerializedUser {
  id: string
}

passport.serializeUser<SerializedUser>(async (user: Express.User, callback) => callback(null, { id: user.keycloakUserId }))

passport.deserializeUser<SerializedUser>(async (identifier, callback): Promise<void> => {
  if (typeof identifier?.id !== "string") {
    return callback(null, null)
  }

  let user: PrismaUser | null = null
  try {
    user = await prisma.user.findUnique({
      where: {
        keycloakUserId: identifier.id,
      }
    })
  } catch (error) {
    return callback(error)
  }

  return callback(null, user)
})
