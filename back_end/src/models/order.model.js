import { transaction } from "../db/database.js";
import { conflict, notFound } from "../utils/http.js";

const ORDER_STATUS = { succeeded: "paid", declined: "failed" };

const round = (value) => Math.round(value * 100) / 100;

export function createOrder(db, { userId, items, couponCode, paymentMethod }) {
  const selectProduct = db.prepare(
    "SELECT id, title, price FROM products WHERE id = ? AND deleted_at IS NULL",
  );

  const lines = items.map(({ id, quantity }) => {
    const product = selectProduct.get(id);
    if (!product) throw notFound(`Product ${id} not found`);
    return {
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
    };
  });

  const subtotal = round(
    lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
  );

  return transaction(db, () => {
    const info = db
      .prepare(
        `INSERT INTO orders
           (user_id, status, subtotal, total)
         VALUES (?, 'pending', ?, ?)`,
      )
      .run(userId, subtotal, subtotal);
    const id = info.lastInsertRowid;

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, title, price, quantity)
       VALUES (?, ?, ?, ?, ?)`,
    );

    for (const line of lines) {
      insertItem.run(id, line.productId, line.title, line.price, line.quantity);
    }
    if (couponCode) {
      updateCoupon(db, id, userId, couponCode);
    }
    if (paymentMethod) {
      changePaymentMethod(db, id, userId, paymentMethod);
    }

    return getOrder(db, id, userId);
  });
}

export function listOrders(db, userId) {
  return db
    .prepare(
      `SELECT id, tag, status, subtotal, discount, total, payment_method,
              payment_reference, payment_reason, created_at AS createdAt, expired_at AS expiredAt
       FROM orders WHERE user_id = ? AND deleted_at IS NULL
       ORDER BY id DESC`,
    )
    .all(userId)
    .map(normalize);
}

export function getOrder(db, id, userId) {
  const row = db
    .prepare(
      `SELECT id, tag, status, subtotal, discount, total, payment_method,
              payment_reference, payment_reason, created_at AS createdAt, expired_at AS expiredAt
       FROM orders WHERE id = ? AND user_id = ? AND deleted_at IS NULL`,
    )
    .get(id, userId);

  if (!row) throw notFound("Order not found");

  const items = db
    .prepare(
      `SELECT product_id AS productId, title, price, quantity
       FROM order_items WHERE order_id = ? ORDER BY id`,
    )
    .all(id);

  return { ...normalize(row), items };
}

export function setPaymentResult(
  db,
  id,
  userId,
  { status, reference, reason },
) {
  const order = getOrder(db, id, userId);
  if (order.status === status) {
    throw conflict(`Order is already ${order.status}`);
  }
  if (new Date(order.expiredAt) < new Date()) {
    throw conflict("Order is expired");
  }

  db.prepare(
    `UPDATE orders
     SET status = ?, payment_reference = ?, payment_reason = ?
     WHERE id = ? AND user_id = ?`,
  ).run(
    ORDER_STATUS[status] ?? "failed",
    reference ?? null,
    reason ?? null,
    id,
    userId,
  );

  return getOrder(db, id, userId);
}

export function updateCoupon(db, ordrrId, userId, code) {
  const order = getOrder(db, ordrrId, userId);
  if (order.status !== "pending") {
    throw conflict(`Order is must be "pending", it is ${order.status}`);
  }
  if (new Date(order.expiredAt) < new Date()) {
    throw conflict("Order is expired");
  }

  const row =
    db
      .prepare(
        "SELECT percent FROM coupons WHERE code = ? AND expired_at > datetime('now')",
      )
      .get(code) ?? null;

  if (!row) throw notFound("Coupon not found");

  const discount = round((order.subtotal * row.percent) / 100);
  const total = round(order.subtotal - discount);
  const info = db
    .prepare(
      "UPDATE orders SET discount = ?, total = ? WHERE id = ? AND user_id = ?",
    )
    .run(discount, total, order.id, userId);
  return { code, percent: row.percent, discount, total };
}

export function changePaymentMethod(db, orderId, userId, paymentMethod) {
  const order = getOrder(db, orderId, userId);
  if (order.status !== "pending") {
    throw conflict(`Order is must be "pending", it is ${order.status}`);
  }
  if (new Date(order.expiredAt) < new Date()) {
    throw conflict("Order is expired");
  }

  const info = db
    .prepare(
      "UPDATE orders SET payment_method = ? WHERE id = ? AND user_id = ?",
    )
    .run(paymentMethod, orderId, userId);
  return getOrder(db, orderId, userId);
}

function normalize(row) {
  return {
    id: row.id,
    tag: row.tag,
    status: row.status,
    subtotal: row.subtotal,
    discount: row.discount,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference ?? null,
    paymentReason: row.payment_reason ?? null,
    createdAt: row.createdAt,
    expiredAt: row.expiredAt,
  };
}
