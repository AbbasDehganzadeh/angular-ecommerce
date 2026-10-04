import { requireAuth } from '../middleware/auth.js';
import {
  createOrder,
  findCoupon,
  getOrder,
  listOrders,
  setPaymentResult,
} from '../models/order.model.js';
import { processPayment } from '../payment/mock.js';
import { notFound } from '../utils/http.js';
import {
  requireArray,
  requireId,
  requireInt,
  requireString,
} from '../utils/validate.js';

export function orderRoutes(router, db) {
  router.post('/api/orders/checkout', (ctx) => {
    const user = requireAuth(ctx);
    const order = createOrder(db, readOrder(ctx.body, user.id));
    const payment = processPayment(readPayment(ctx.body, order.total));
    return {
      order: setPaymentResult(db, order.id, user.id, payment),
      payment,
    };
  });

  router.post('/api/orders', (ctx) => {
    const user = requireAuth(ctx);
    return { order: createOrder(db, readOrder(ctx.body, user.id)) };
  });

  router.get('/api/orders', (ctx) => ({
    orders: listOrders(db, requireAuth(ctx).id),
  }));

  router.get('/api/orders/:id', (ctx) => {
    const user = requireAuth(ctx);
    return { order: getOrder(db, requireId(ctx.params.id), user.id) };
  });

  router.post('/api/orders/:id/pay', (ctx) => {
    const user = requireAuth(ctx);
    const id = requireId(ctx.params.id);
    const order = getOrder(db, id, user.id);
    const payment = processPayment(readPayment(ctx.body, order.total));

    return {
      order: setPaymentResult(db, id, user.id, payment),
      payment,
    };
  });

  router.post('/api/coupons/validate', (ctx) => {
    const code = requireString(ctx.body.code, 'code', { max: 32 }).toUpperCase();
    const coupon = findCoupon(db, code);
    if (!coupon) throw notFound('Invalid discount code');
    return { code, percent: coupon.percent };
  });
}

function readOrder(body, userId) {
  const items = requireArray(body.items, 'items', { max: 50 }).map(
    (item, index) => ({
      id: requireId(item?.id, `items[${index}].id`),
      quantity: requireInt(item?.quantity ?? 1, `items[${index}].quantity`, {
        min: 1,
        max: 99,
      }),
    })
  );

  return {
    userId,
    items,
    couponCode: body.couponCode
      ? requireString(body.couponCode, 'couponCode', { max: 32 }).toUpperCase()
      : null,
    paymentMethod: readPaymentMethod(body),
  };
}

function readPaymentMethod(body) {
  const method = body.payment?.method ?? body.paymentMethod ?? 'card';
  return requireString(method, 'payment.method', { max: 32 });
}

function readPayment(body, amount) {
  return {
    method: readPaymentMethod(body),
    amount,
    card: body.payment?.card ?? body.card,
  };
}
