import { promisify } from "util";
import * as EmailValidator from "email-validator";

export const validateEmail = promisify((email: string, callback: EmailValidator.AsyncCallback) => { return EmailValidator.validate_async(email, callback); } );

export function isPositiveInteger(str: string) {
  if (typeof str !== "string") {
    return false;
  }
  const num = Number(str);
  if (Number.isInteger(num) && num >= 0) {
    return true;
  }
  return false;
}