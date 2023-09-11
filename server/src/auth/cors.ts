import * as process from "process";


export const allowedOrigins = new Set<string>([
  "https://live.durhack.com",
]);

export const allowedDevOrigins = new Set<string>([
  "http://localhost:8080",
]);

export function checkOriginForCors (origin, callback) {
  if (allowedOrigins.has(origin)) return callback(null, true);
  if (process.env.NODE_ENV !== "production" && allowedDevOrigins.has(origin)) return callback(null, true);
  return callback(new Error("Not allowed!"));
}

export const defaultCorsOptions = {
  origin: checkOriginForCors,
};