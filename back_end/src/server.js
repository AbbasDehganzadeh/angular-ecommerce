import { createServer } from "node:http";

import { config } from "./config.js";
import { openDatabase } from "./db/database.js";
import { seed } from "./db/seed.js";
import { authenticate } from "./middleware/auth.js";
import { authRoutes } from "./routes/auth.routes.js";
import { orderRoutes } from "./routes/order.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { HttpError, notFound, readJson, sendJson } from "./utils/http.js";
import { createRouter } from "./utils/router.js";

const METHODS_WITH_BODY = new Set(["POST", "PATCH", "PUT", "DELETE"]);

export function createApp({
  dbPath = config.dbPath,
  withSeed = config.seed,
} = {}) {
  const db = openDatabase(dbPath);
  if (withSeed) seed(db);

  const router = createRouter();
  authRoutes(router, db);
  userRoutes(router, db);
  productRoutes(router, db);
  orderRoutes(router, db);

  const server = createServer(async (req, res) => {
    applyCors(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const ctx = { req, res, db, params: {}, query: {}, body: {}, user: null };

    try {
      const { pathname, query } = splitUrl(req.url ?? "/");
      console.info({ pathname, query });
      const route = router.match(req.method ?? "GET", pathname);
      if (!route) throw notFound(`No route for ${req.method} ${pathname}`);

      ctx.params = route.params;
      ctx.query = Object.fromEntries(query);

      if (METHODS_WITH_BODY.has(req.method ?? "GET")) {
        ctx.body = await readJson(req, config.bodyLimitBytes);
      }

      authenticate(ctx);

      for (const handler of route.handlers) {
        const result = await handler(ctx);
        if (result !== undefined) {
          sendJson(res, 200, result);
          return;
        }
      }

      sendJson(res, 204);
    } catch (error) {
      handleError(res, error);
    }
  });

  server.on("close", () => db.close());
  return server;
}

function applyCors(res) {
  const origins =
    config.corsOrigin === "*" ? ["*"] : config.corsOrigin.split(",");

  res.setHeader("Access-Control-Allow-Origin", origins.join(","));
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
}

function handleError(res, error) {
  if (res.headersSent) {
    res.end();
    return;
  }

  if (error instanceof HttpError) {
    sendJson(res, error.status, {
      error: {
        status: error.status,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  console.error(error);
  sendJson(res, 500, {
    error: { status: 500, message: "Internal server error" },
  });
}

function splitUrl(url) {
  const [pathname, search = ""] = url.split("?");
  return { pathname, query: new URLSearchParams(search) };
}

export function startServer() {
  const server = createApp();

  server.listen(config.port, config.host, () => {
    console.log(`API listening on http://${config.host}:${config.port}`);
    console.log(`Database: ${config.dbPath}`);
    if (config.tokenSecret === "dev-only-insecure-secret") {
      console.warn(
        "Warning: using the default TOKEN_SECRET, set it in production",
      );
    }
  });

  return server;
}

if (process.argv[1]?.endsWith("server.js")) {
  startServer();
}
