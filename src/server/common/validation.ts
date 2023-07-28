import { promisify } from "util";

export function strIsPositiveInteger(str: unknown) {
  if (typeof str !== "string") {
    return false;
  }
  const num = Number(str);

  return Number.isInteger(num) && num >= 0;
}
