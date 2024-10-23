import assert from "node:assert/strict"
import { z } from "zod"

import { requireUserHasOne, requireUserIsAdmin } from "@server/common/decorators"
import { UserRole } from "@server/common/model-enums"
import type { Middleware, Request, Response } from "@server/types"
import { prisma, Quest_dependency_mode } from "@server/database"

class QuestsHandlers {
  @requireUserIsAdmin()
  getQuestListAdmin(): Middleware {
    return async (_request: Request, response: Response): Promise<void> => {
      // todo: this needs to be paginated
      const result = await prisma.quest.findMany({
        include: { challenges: { select: { challengeId: true, name: true } } },
        orderBy: { createdAt: "desc" },
      })

      const payload = result.map((quest) => ({
        id: quest.questId,
        name: quest.name,
        description: quest.description,
        dependency_mode: quest.dependencyMode,
        value: quest.points,
        challenges: quest.challenges.map(challenge => ({
          id: challenge.challengeId,
          name: challenge.name
        }))
      }))

      response.status(200)
      response.json({
        status: 200,
        message: "OK",
        quests: payload,
      })
    }
  }

  @requireUserHasOne(UserRole.hacker)
  getQuestListHacker(): Middleware {
    return async (request: Request, response: Response) => {
      const user = request.user
      assert(user != null)

      const result = await prisma.quest.findMany({
        include: {
          challenges: {
            include: {
              qrCodes: {
                include: {
                  redeems: { where: { redeemerUserId: user.keycloakUserId } },
                },
              },
            },
          },
          usersCompleted: { where: { keycloakUserId: user.keycloakUserId } }
        }
      });

      const payload = result.map((quest) => ({
        name: quest.name,
        description: quest.description,
        dependency_mode: quest.dependencyMode,
        value: quest.points,
        completed: quest.usersCompleted.length > 0,
        challenges: quest.challenges.map(challenge => ({
          name: challenge.name,
          description: challenge.description,
          completed: challenge.qrCodes.reduce((count, code) => count + code.redeems.length, 0) > 0
        }))
      }))

      response.json({
        status: 200,
        message: "OK",
        quests: payload,
      })
    }
  }

  static createQuestPayloadSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    dependencyMode: z.nativeEnum(Quest_dependency_mode),
    points: z.number().nonnegative().optional(),
    challenges: z.array(z.number()),
  })

  @requireUserIsAdmin()
  createQuest(): Middleware {
    return async (request: Request, response: Response) => {
      const create_attributes = QuestsHandlers.createQuestPayloadSchema.parse(request.body)

      const new_instance = await prisma.quest.create({
        data: {
          ...create_attributes,
          challenges: { connect: create_attributes.challenges.map((id) => ({ challengeId: id })) },
        },
      });

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: { ...new_instance },
      })
    }
  }

  @requireUserIsAdmin()
  patchQuestDetails(): Middleware {
    return async (request: Request, response: Response) => {
      const { quest_id } = response.locals
      if (typeof quest_id !== "number") throw new Error("Parsed `quest_id` not found.")
      
      const update_attributes = QuestsHandlers.createQuestPayloadSchema.parse(request.body)

      const new_instance = await prisma.quest.update({
        where: { questId: quest_id },
        data: {
          ...update_attributes,
          challenges: { set: update_attributes.challenges.map((id) => ({ challengeId: id })) },
        },
      });

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        data: { ...new_instance },
      })
    }
  }
}

const questsHandlers = new QuestsHandlers()
export { questsHandlers }
