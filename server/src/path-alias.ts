import { replaceTscAliasPaths } from "tsc-alias"

function registerModuleAliases() {
  // check if running in ts-node; do nothing if so
  // @ts-ignore
  if (process[Symbol.for("ts-node.register.instance")]) return

  void replaceTscAliasPaths({
    configFile: "tsconfig.server.json",
  })
}

registerModuleAliases()
