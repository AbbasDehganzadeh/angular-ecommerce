import { notFound } from "../utils/http.js";

const COLUMNS = `id, title, description, price, category, uri,
  rating_rate, rating_count,
  rating_rate AS "rating.rate", rating_count AS "rating.count"`;

const SORT_CLAUSES = {
  alphabet: "title COLLATE NOCASE ASC",
  "~alphabet": "title COLLATE NOCASE DESC",
  price: "price ASC",
  "~price": "price DESC",
  rating: "rating_rate DESC",
  "~rating": "rating_rate ASC",
  count: "rating_count DESC",
  "~count": "rating_count ASC",
};

export const SORT_KEYS = Object.keys(SORT_CLAUSES);

export function listProducts(
  db,
  { category, search, min, max, sort, limit, offset } = {},
) {
  const conditions = [];
  const values = [];

  if (category) {
    conditions.push("category = ? COLLATE NOCASE");
    values.push(category);
  }
  if (search) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }
  if (min !== undefined) {
    conditions.push("price >= ?");
    values.push(min);
  }
  if (max !== undefined) {
    conditions.push("price <= ?");
    values.push(max);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = SORT_CLAUSES[sort] ?? SORT_CLAUSES.alphabet;
  const sql = `SELECT ${COLUMNS} FROM products ${where}
    ORDER BY ${order} LIMIT ? OFFSET ?`;

  return db
    .prepare(sql)
    .all(...values, limit ?? 100, offset ?? 0)
    .map(normalize);
}

export function findProduct(db, id) {
  const row = db
    .prepare(`SELECT ${COLUMNS} FROM products WHERE id = ?`)
    .get(id);
  return row ? normalize(row) : null;
}

export function getProduct(db, id) {
  const product = findProduct(db, id);
  if (!product) throw notFound("Product not found");
  return product;
}

export function listCategories(db) {
  return db
    .prepare(
      `SELECT DISTINCT category FROM products
       ORDER BY category COLLATE NOCASE ASC`,
    )
    .all()
    .map((row) => row.category);
}

export function createProduct(db, product) {
  const info = db
    .prepare(
      `INSERT INTO products
         (title, description, price, category, uri, rating_rate, rating_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      product.title,
      product.description ?? "",
      product.price,
      product.category,
      product.uri ?? "",
      product.rating?.rate ?? 0,
      product.rating?.count ?? 0,
    );

  return findProduct(db, Number(info.lastInsertRowid));
}

export function updateProduct(db, id, patch) {
  const columns = {
    title: "title",
    description: "description",
    price: "price",
    category: "category",
    uri: "uri",
    rate: "rating_rate",
    count: "rating_count",
  };

  const assignments = [];
  const values = [];
  const fields = { ...patch };

  if (patch.rating) {
    fields.rate = patch.rating.rate;
    fields.count = patch.rating.count;
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || !(key in columns)) continue;
    assignments.push(`${columns[key]} = ?`);
    values.push(value);
  }

  if (assignments.length === 0) return getProduct(db, id);

  values.push(id);
  const info = db
    .prepare(`UPDATE products SET ${assignments.join(", ")} WHERE id = ?`)
    .run(...values);

  if (info.changes === 0) throw notFound("Product not found");
  return getProduct(db, id);
}

export function deleteProduct(db, id) {
  const info = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  if (info.changes === 0) throw notFound("Product not found");
}

function normalize(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: row.category,
    uri: row.uri,
    rating: { rate: row.rating_rate, count: row.rating_count },
  };
}
