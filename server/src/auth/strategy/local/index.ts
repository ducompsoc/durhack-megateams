import Local, { VerifyFunction as LocalVerifyFunction } from "passport-local";
import passport from "passport";

import { NullError } from "@server/common/errors";
import User from "@server/database/tables/user";
import { checkPassword } from "@server/auth/passwords";


/**
 * Verify function for Passport.js 'local' strategy (username and password).
 *
 * @param username - email address to search for user with
 * @param password - password to attempt to log in as user with
 * @param callback - function to call with (error, user) when done
 */
const localVerifyFunction: LocalVerifyFunction = async function(username, password, callback) {
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

const local_strategy = new Local.Strategy(localVerifyFunction);

passport.use("local", local_strategy);