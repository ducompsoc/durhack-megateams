import { promisify } from "util";
import { pbkdf2, timingSafeEqual } from "crypto";
import { VerifyFunction } from "passport-local";

import User from "@server/database/user";
import { NullError } from "@server/common/errors";


const promise_pbkdf2 = promisify(pbkdf2);

export function validatePassword(password: string): boolean {
  /**
   * Returns whether the password is permitted - it contains no illegal characters
   *
   * @param password - the password to validate
   * @returns whether or not the password is valid
   */
  return true;
}

export async function hashPasswordText(password: string, salt: Buffer): Promise<Buffer> {
  /**
   * Returns hashed text for password storage/comparison.
   *
   * @param password - the text to hash
   * @param salt - the salt to hash with
   * @returns the hashed password bytes
   */
  const normalized_password = password.normalize();
  // hash the text, for 310,000 iterations, using the SHA256 algorithm with an output key (hash) length of 32 bytes
  return await promise_pbkdf2(normalized_password, salt, 310000, 32, "sha256");
}

export async function checkPassword(user: User, password_attempt: string): Promise<boolean> {
  /**
   * Returns whether the password attempt is correct for the provided user.
   *
   * @param user - the user to compare against
   * @param password_attempt - the password attempt to check
   * @returns whether the password attempt matches the user's password hash
   */
  if (!(user.password_salt instanceof Buffer && user.hashed_password instanceof Buffer)) {
    throw new NullError("Password has not been set");
  }

  const hashed_password_attempt = await hashPasswordText(password_attempt, user.password_salt);
  return timingSafeEqual(hashed_password_attempt, user.hashed_password);
}

export const localVerifyFunction: VerifyFunction = async function(username, password, callback) {
  /**
   * Verify function for Passport.js.
   *
   * @param username - email address to search for user with
   * @param password - password to attempt to log in as user with
   * @param callback - function to call with (error, user) when done
   */
  let user;
  try {
    user = await User.findOne({ where: { email: username }, rejectOnEmpty: new NullError() });
  } catch (error) {
    if (error instanceof NullError) {
      return callback(null, false, { message: "Incorrect username or password." });
    }
    return callback(error);
  }

  try {
    if (!await checkPassword(user, password)) {
      return callback(null, false, { message: "Incorrect username or password." });
    }
  } catch (error) {
    return callback(error);
  }

  return callback(null, user);
};