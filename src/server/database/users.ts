import { User } from "@/server/common/models";
import database from "./";

interface userIdentifier {
  id: number,
}

export function listUsers(): userIdentifier[] {
  throw new Error("Not implemented.");
}

export function getUser(id: number): User {
  throw new Error("Not implemented.");
}