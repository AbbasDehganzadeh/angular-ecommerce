import {
  deleteUser,
  findById,
  toPublicUser,
  updateUser,
} from "../models/user.model.js";
import { requireAuth } from "../middleware/auth.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { unauthorized } from "../utils/http.js";
import {
  optionalString,
  requireEmail,
  requireString,
} from "../utils/validate.js";

export function userRoutes(router, db) {
  router.get("/api/users/me", (ctx) => ({ user: requireAuth(ctx) }));

  router.patch("/api/users/me", (ctx) => {
    const user = requireAuth(ctx);
    const patch = {};

    const name = optionalString(ctx.body.name, "name", { max: 64 });
    if (name !== undefined) patch.name = name;

    if (ctx.body.email !== undefined)
      patch.email = requireEmail(ctx.body.email);
    if (ctx.body.password !== undefined) {
      const current = findById(db, user.id);
      if (
        !verifyPassword(
          String(ctx.body.currentPassword ?? ""),
          current.password,
        )
      ) {
        throw unauthorized("Current password is incorrect");
      }
      patch.password = hashPassword(
        requireString(ctx.body.password, "password", { min: 5, max: 128 }),
      );
    }

    const row = updateUser(db, user.id, patch);
    return { user: toPublicUser(row) };
  });

  router.delete("/api/users/me", (ctx) => {
    const user = requireAuth(ctx);
    const row = findById(db, user.id);
    const password = requireString(ctx.body?.password, "password", {
      max: 128,
    });

    if (!verifyPassword(password, row.password)) {
      throw unauthorized("Password is incorrect");
    }

    deleteUser(db, user.id);
  });
}
