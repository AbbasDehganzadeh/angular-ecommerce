import { conflict, notFound } from "../utils/http.js";
import { formatDateNow } from "../utils/format.js";

const COLUMNS =
  "id, username, name, email, password, created_at AS createdAt, last_loggedin AS lastLoggedin";

export function toPublicUser(row) {
  return {
    id: row.id,
    username: row.username,
    name: row.name ?? undefined,
    email: row.email,
    createdAt: row.createdAt,
    lastLoggedin: row.lastLoggedin,
  };
}

export function findById(db, id) {
  return (
    db
      .prepare(
        `SELECT ${COLUMNS} FROM users WHERE id = ? AND deleted_at IS NULL`,
      )
      .get(id) ?? null
  );
}

export function findByIdentifier(db, identifier) {
  return (
    db
      .prepare(
        `SELECT ${COLUMNS} FROM users
         WHERE username = ? COLLATE NOCASE
            OR email = ? COLLATE NOCASE
	    AND deleted_at IS NULL`,
      )
      .get(identifier, identifier) ?? null
  );
}

export function createUser(db, { username, name, email, password }) {
  if (findByIdentifier(db, username) || findByIdentifier(db, email)) {
    throw conflict("User with this username or email already exists!");
  }

  const info = db
    .prepare(
      `INSERT INTO users (username, name, email, password)
       VALUES (?, ?, ?, ?)`,
    )
    .run(username, name ?? null, email ?? null, password);

  return findById(db, Number(info.lastInsertRowid));
}

export function updateLogin(db, id) {
  db.prepare(
    "UPDATE users SET last_loggedin = ? WHERE id = ? AND deleted_at IS NULL",
  ).run(formatDateNow(), id);
  return findById(db, id);
}

export function updateUser(db, id, patch) {
  const assignments = [];
  const values = [];

  for (const [column, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    assignments.push(`${column} = ?`);
    values.push(value);
  }

  if (assignments.length === 0) {
    const current = findById(db, id);
    if (!current) throw notFound("User not found");
    return current;
  }

  values.push(id);
  db.prepare(`UPDATE users SET ${assignments.join(", ")} WHERE id = ?`).run(
    ...values,
  );

  return findById(db, id);
}

export function deleteUser(db, id) {
  const user = findById(db, id);
  if (user === null) throw notFound("User not found");
  db.prepare("UPDATE users SET deleted_at = ? WHERE id = ?").run(
    formatDateNow(),
    id,
  );
}
