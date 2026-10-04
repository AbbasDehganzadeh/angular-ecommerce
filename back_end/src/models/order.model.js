import { transaction } from '../db/database.js';
import { conflict, notFound } from '../utils/http.js';

const ORDER_STATUS = { succeeded: 'paid', declined: 'failed' };

const round = (value) => Math.round(value * 100) / 100;

export function createOrder(db, { userId, items, couponCode, paymentMethod }) {
  const selectProduct = db.prepare(
    'SELECT id, title, price FROM products WHERE id = ?'
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
    lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  );

  let percent = 0;
  if (couponCode) {
    const coupon = db
      .prepare('SELECT percent FROM coupons WHERE code = ?')
      .get(couponCode);
    if (!coupon) throw notFound('Invalid discount code');
    percent = coupon.percent;
  }

  const discount = round((subtotal * percent) / 100);
  const total = round(subtotal - discount);

  return transaction(db, () => {
    const info = db
      .prepare(
        `INSERT INTO orders
           (user_id, status, subtotal, discount, total, payment_method)
         VALUES (?, 'pending', ?, ?, ?, ?)`
      )
      .run(userId, subtotal, discount, total, paymentMethod);

    const orderId = Number(info.lastInsertRowid);
    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, title, price, quantity)
       VALUES (?, ?, ?, ?, ?)`
    );

    for (const line of lines) {
      insertItem.run(
        orderId,
        line.productId,
        line.title,
        line.price,
        line.quantity
      );
    }

    return getOrder(db, orderId, userId);
  });
}

export function listOrders(db, userId) {
  return db
    .prepare(
      `SELECT id, status, subtotal, discount, total, payment_method,
              payment_reference, payment_reason, created_at AS createdAt
       FROM orders WHERE user_id = ?
       ORDER BY id DESC`
    )
    .all(userId)
    .map(normalize);
}

export function getOrder(db, id, userId) {
  const row = db
    .prepare(
      `SELECT id, status, subtotal, discount, total, payment_method,
              payment_reference, payment_reason, created_at AS createdAt
       FROM orders WHERE id = ? AND user_id = ?`
    )
    .get(id, userId);

  if (!row) throw notFound('Order not found');

  const items = db
    .prepare(
      `SELECT product_id AS productId, title, price, quantity
       FROM order_items WHERE order_id = ? ORDER BY id`
    )
    .all(id);

  return { ...normalize(row), items };
}

export function setPaymentResult(db, id, userId, { status, reference, reason }) {
  const order = getOrder(db, id, userId);
  if (order.status !== 'pending') {
    throw conflict(`Order is already ${order.status}`);
  }

  db.prepare(
    `UPDATE orders
     SET status = ?, payment_reference = ?, payment_reason = ?
     WHERE id = ? AND user_id = ?`
  ).run(
    ORDER_STATUS[status] ?? 'failed',
    reference ?? null,
    reason ?? null,
    id,
    userId
  );

  return getOrder(db, id, userId);
}

export function findCoupon(db, code) {
  return db.prepare('SELECT percent FROM coupons WHERE code = ?').get(code) ?? null;
}

function normalize(row) {
  return {
    id: row.id,
    status: row.status,
    subtotal: row.subtotal,
    discount: row.discount,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference ?? null,
    paymentReason: row.payment_reason ?? null,
    createdAt: row.createdAt,
  };
}
