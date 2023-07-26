import { promisify } from "util";

export function isPositiveInteger(str: string) {
  if (typeof str !== "string") {
    return false;
  }
  const num = Number(str);

  return Number.isInteger(num) && num >= 0;
}
