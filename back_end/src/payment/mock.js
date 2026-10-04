import { randomBytes } from 'node:crypto';
import { HttpError } from '../utils/http.js';

const SUPPORTED_METHODS = ['card', 'cash_on_delivery', 'wallet'];

const TEST_CARDS = {
  '4242424242424242': { status: 'succeeded' },
  '4000000000000002': { status: 'declined', reason: 'insufficient_funds' },
  '4000000000009995': { status: 'declined', reason: 'card_declined' },
  '4000000000000069': { status: 'declined', reason: 'expired_card' },
  '4000000000000000': { status: 'declined', reason: 'lost_card' },
};

function reference(method) {
  const suffix = randomBytes(4).toString('hex');
  return `mock_${method}_${Date.now().toString(36)}_${suffix}`;
}

function luhn(value) {
  let sum = 0;
  let double = false;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = value.charCodeAt(index) - 48;
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

export function processPayment({ method = 'card', amount, card }) {
  if (!SUPPORTED_METHODS.includes(method)) {
    throw new HttpError(
      422,
      `Unsupported payment method: ${method}. Use one of ${SUPPORTED_METHODS.join(', ')}`
    );
  }

  const id = reference(method);

  if (method !== 'card') {
    return {
      status: 'succeeded',
      reason: 'approved',
      method,
      reference: id,
      amount,
    };
  }

  const number = String(card?.number ?? '').replace(/[\s-]/g, '');
  if (!/^\d{12,19}$/.test(number)) {
    throw new HttpError(422, "Invalid 'card.number': expected 12 to 19 digits");
  }

  if (!luhn(number)) {
    return {
      status: 'declined',
      reason: 'invalid_card_number',
      method,
      reference: id,
      amount,
    };
  }

  const testCard = TEST_CARDS[number];
  if (testCard?.status === 'declined') {
    return {
      status: 'declined',
      reason: testCard.reason,
      method,
      reference: id,
      amount,
      last4: number.slice(-4),
    };
  }

  return {
    status: 'succeeded',
    reason: 'approved',
    method,
    reference: id,
    amount,
    last4: number.slice(-4),
  };
}
