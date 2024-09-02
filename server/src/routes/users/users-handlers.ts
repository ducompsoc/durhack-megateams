import { z } from "zod"

import { requireSelf, requireUserIsAdmin } from "@server/common/decorators"
import { NullError } from "@server/common/errors"
import { prisma } from "@server/database"
import type { Middleware, Request, Response } from "@server/types"

export const patchUserPayloadSchema = z.object({
  teamId: z.number().optional(),
})

class UsersHandlers {
  /**
   * Handles an unauthenticated or non-admin GET request to /users.
   * Returns a list of user IDs and preferred names that cannot be filtered.
   */
  getUsersListDefault(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      const result = await prisma.user.findMany({
        select: {
          keycloakUserId: true,
          // todo: this used to provide preferred names
        },
      })
      response.status(200)
      response.json({
        status: 200,
        message: "OK",
        users: result,
      })
    }
  }

  /**
   * Handles an authenticated admin GET request to /users.
   * Returns a list of user IDs and preferred names.
   * using URL search parameters.
   */
  @requireUserIsAdmin()
  getUsersListAsAdmin(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      /*
      todo: joe thinks this whole handler needs a rework.
           It should query the Keycloak admin API for a 'page' (sub-list) of users that match the (email) search term,
           look those up in the database for 'points' totals, defaulting to 0, and return that.
       */
      const result = await prisma.user.findMany({
        select: {
          keycloakUserId: true,
          points: true,
          team: {
            include: {
              area: {
                include: { megateam: true },
              },
            },
          },
        },
      })

      const payload = result.map((user) => ({
        id: user.keycloakUserId,
        // todo: this used to provide preferred name and email too (see above note)
        points: prisma.point.sumPoints(user.points),
        team_name: user.team?.teamName,
        team_id: user.team?.teamId,
        megateam_name: user.team?.area?.megateam?.megateamName,
      }))

      response.status(200)
      response.json({
        status: 200,
        message: "OK",
        users: payload,
      })
    }
  }

  /**
   * Handles an unauthenticated or non-admin GET request to /users/:id.
   * Returns the user's basic details including team affiliation, points, etc.
   */
  getUserDetailsDefault(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      const result = await prisma.user.findUnique({
        where: { keycloakUserId: request.params.user_id },
        select: {
          keycloakUserId: true,
          // todo: this also retrieved preferred name
          team: true,
          points: true,
        },
      })
      if (result == null) throw new NullError()

      const payload = {
        ...result,
        points: prisma.point.sumPoints(result.points),
      }

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: payload,
      })
    }
  }

  private async doGetAllUserDetails(request: Request, response: Response): Promise<void> {
    const result = await prisma.user.findUnique({
      where: { keycloakUserId: request.params.user_id },
      include: {
        team: true,
        points: true,
      },
    })
    if (result == null) throw new NullError()

    const payload = {
      ...result,
      points: prisma.point.sumPoints(result.points),
    }

    response.status(200)
    response.json({
      status: response.statusCode,
      message: "OK",
      data: payload,
    })
  }

  /**
   * Handles an authenticated admin GET request to /users/:id.
   * Returns all the user's details, including Hackathons UK fields.
   */
  @requireUserIsAdmin()
  getUserDetailsAsAdmin(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      await this.doGetAllUserDetails(request, response)
    }
  }

  /**
   * Handles an authenticated self GET request to /users/:id.
   * Returns all the user's details, including Hackathons UK fields.
   */
  @requireSelf()
  getMyUserDetails(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      await this.doGetAllUserDetails(request, response)
    }
  }

  static getPatchHandler(payload_schema: z.Schema) {
    return async (request: Request, response: Response): Promise<void> => {
      const parsed_payload = payload_schema.parse(request.body)

      const found_user = await prisma.user.update({
        where: { keycloakUserId: request.params.user_id },
        data: parsed_payload,
      })

      response.status(200)
      response.json({ status: response.statusCode, message: "OK" })
    }
  }

  /**
   * Handles an authenticated admin POST request to /users/:id.
   * Allows editing of all fields excluding password.
   */
  @requireUserIsAdmin()
  patchUserDetailsAsAdmin(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      await UsersHandlers.getPatchHandler(patchUserPayloadSchema)(request, response)
    }
  }

  /**
   * Handles an authenticated hacker self POST request to /users/:id.
   * Allows editing of all MLH fields, email, etc.
   */
  @requireSelf()
  patchMyUserDetails(): Middleware {
    return async (request: Request, response: Response, next: () => void): Promise<void> => {
      next()
    }
  }

  /**
   * Handles an authenticated admin DELETE request to /users/:id.
   * Deletes the resource.
   */
  @requireUserIsAdmin()
  deleteUserAsAdmin(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      const result = await prisma.user.delete({
        where: { keycloakUserId: request.params.user_id },
      })

      response.status(200)
      response.json({ status: response.statusCode, message: "OK" })
    }
  }
}

const usersHandlers = new UsersHandlers()
export { usersHandlers }
