import { clearSession, issueSession, requireAuth } from "../middleware/auth.js";
import {
  createUser,
  findByIdentifier,
  toPublicUser,
  updateLogin,
} from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { unauthorized } from "../utils/http.js";
import {
  optionalString,
  requireEmail,
  requireString,
} from "../utils/validate.js";

export function authRoutes(router, db) {
  router.post("/api/auth/signup", (ctx) => {
    const username = requireString(ctx.body.username, "username", {
      min: 3,
      max: 32,
    });
    const email = requireEmail(ctx.body.email);
    const password = requireString(ctx.body.password, "password", {
      min: 5,
      max: 128,
    });
    const name = optionalString(ctx.body.name, "name", { max: 64 });

    const user = createUser(db, {
      username,
      email,
      password: hashPassword(password),
      name,
    });

    updateLogin(db, user.id);
    return { user: toPublicUser(user), token: issueSession(ctx.res, user) };
  });

  router.post("/api/auth/login", (ctx) => {
    const identifier = requireString(ctx.body.identifier, "identifier", {
      max: 254,
    });
    const password = requireString(ctx.body.password, "password", {
      max: 128,
    });

    const row = findByIdentifier(db, identifier);
    if (!row || !verifyPassword(password, row.password)) {
      throw unauthorized("Invalid credentials");
    }

    updateLogin(db, row.id);
    return { user: toPublicUser(row), token: issueSession(ctx.res, row) };
  });

  router.post("/api/auth/logout", (ctx) => {
    clearSession(ctx.res);
  });

  router.get("/api/auth/me", (ctx) => ({ user: requireAuth(ctx) }));
}
