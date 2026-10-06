import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function toInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  env: process.env.NODE_ENV ?? "development",
  host: process.env.HOST ?? "0.0.0.0",
  port: toInt(process.env.PORT, 3030),
  dbPath: process.env.DB_PATH ?? path.join(rootDir, "data", "shop.db"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:4200",
  tokenSecret: process.env.TOKEN_SECRET ?? "dev-only-insecure-secret",
  tokenTtlSeconds: toInt(process.env.TOKEN_TTL, 7 * 24 * 60 * 60),
  cookieName: process.env.COOKIE_NAME ?? "SHOP_USER_KEY",
  bodyLimitBytes: toInt(process.env.BODY_LIMIT, 1024 * 1024),
  seed: process.env.SEED !== "false",
};
