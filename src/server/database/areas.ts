import { Area } from "@/server/common/models";
import database from "./";

interface areaIdentifier {
  id: number,
  name: string,
}

export function listAreas(): areaIdentifier[] {
  throw new Error("Not implemented.");
}

export function getArea(id: number): Area {
  throw new Error("Not implemented.");
}