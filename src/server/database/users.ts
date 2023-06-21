import { User } from "@/server/common/models";
import database from "./";

interface userIdentifier {
  id: number,
  full_name: string,
}

export function listUsers(): userIdentifier[] {
  throw new Error("Not implemented.");
}

export function getUser(id: number): User {
  throw new Error("Not implemented.");
}