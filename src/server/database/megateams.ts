import { Megateam } from "@/server/common/models";
import database from "./";

interface megateamIdentifier {
  id: number,
  name: string,
}

export function listMegateams(): megateamIdentifier[] {
  throw new Error("Not implemented.");
}

export function getMegateam(id: number): Megateam {
  throw new Error("Not implemented.");
}