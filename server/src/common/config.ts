import { config } from "dotenv";

const result = config({path: ".env.local"});

if (result.error) {
  throw result.error;
}