import path from "node:path"
import { getTokenVault } from "@durhack/token-vault"

import { tokenVaultConfig } from "@server/config"
import { User } from "@server/database/tables"

function resolveFilePathFromProjectRoot(path_to_resolve: string): string {
  return path.resolve(path.join(import.meta.dirname, "..", path_to_resolve))
}

export default await getTokenVault<User>({
  getUserIdentifier: (user: User) => user.id.toString(),
  findUniqueUser: async (userId: unknown) => {
    if (typeof userId !== "string") return null
    const id = Number.parseInt(userId)
    if (Number.isNaN(id)) return null
    return await User.findOne({ where: { id } })
  },
  filePathResolver: resolveFilePathFromProjectRoot,
  ...tokenVaultConfig,
})
