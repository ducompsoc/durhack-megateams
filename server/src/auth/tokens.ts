import path from "node:path"
import { getTokenVault } from "@durhack/token-vault"

import config from "config"
import { tokenVaultOptionsSchema } from "@durhack/token-vault/config-schema"
import { User } from "@server/database/tables"

function resolveFilePathFromProjectRoot(path_to_resolve: string): string {
  return path.resolve(path.join(import.meta.dirname, "..", path_to_resolve))
}

export default await getTokenVault<User>({
  getUserIdentifier: (user: User) => user.id.toString(),
  findUniqueUser: async (userId: unknown) => {
    if (typeof userId !== "string") return null
    const id = parseInt(userId)
    if (isNaN(id)) return null
    return await User.findOne({ where: { id } })
  },
  filePathResolver: resolveFilePathFromProjectRoot,
  ...tokenVaultOptionsSchema.parse(config.get("jwt")),
})
