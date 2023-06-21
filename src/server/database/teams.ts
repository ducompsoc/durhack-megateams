import { TeamModel } from "@/server/common/models";
import database from "./";

interface teamIdentifier {
  id: number,
  name: string,
}

export function listTeams(): teamIdentifier[] {
  throw new Error("Not implemented.");
}

export function getTeam(id: number): TeamModel {
  throw new Error("Not implemented.");
}