import { conflict, notFound } from '../utils/http.js';

const COLUMNS =
  'id, username, name, email, email1, password, created_at AS createdAt';

export function toPublicUser(row) {
  return {
    id: row.id,
    username: row.username,
    name: row.name ?? undefined,
    email: row.email,
    email1: row.email1 ?? undefined,
    createdAt: row.createdAt,
  };
}

export function findById(db, id) {
  return db.prepare(`SELECT ${COLUMNS} FROM users WHERE id = ?`).get(id) ?? null;
}

export function findByIdentifier(db, identifier) {
  return (
    db
      .prepare(
        `SELECT ${COLUMNS} FROM users
         WHERE username = ? COLLATE NOCASE
            OR email = ? COLLATE NOCASE
            OR email1 = ? COLLATE NOCASE`
      )
      .get(identifier, identifier, identifier) ?? null
  );
}

export function createUser(db, { username, name, email, email1, password }) {
  if (findByIdentifier(db, username) || findByIdentifier(db, email)) {
    throw conflict('User with this username or email already exists!');
  }
  if (email1 && findByIdentifier(db, email1)) {
    throw conflict('User with this email already exists!');
  }

  const info = db
    .prepare(
      `INSERT INTO users (username, name, email, email1, password)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(username, name ?? null, email, email1 ?? null, password);

  return findById(db, Number(info.lastInsertRowid));
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
    if (!current) throw notFound('User not found');
    return current;
  }

  values.push(id);
  db.prepare(`UPDATE users SET ${assignments.join(', ')} WHERE id = ?`).run(
    ...values
  );

  return findById(db, id);
}

export function deleteUser(db, id) {
  const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  if (info.changes === 0) throw notFound('User not found');
}
