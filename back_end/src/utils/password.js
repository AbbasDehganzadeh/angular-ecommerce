import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;
const COST = { N: 16384, r: 8, p: 1 };

export function hashPassword(plainPassword) {
  const salt = randomBytes(16);
  const hash = scryptSync(plainPassword, salt, KEY_LENGTH, COST);
  return `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export function verifyPassword(plainPassword, storedPassword) {
  if (typeof plainPassword !== 'string' || typeof storedPassword !== 'string') {
    return false;
  }

  const [scheme, salt, hash] = storedPassword.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;

  const expected = Buffer.from(hash, 'base64url');
  const actual = scryptSync(
    plainPassword,
    Buffer.from(salt, 'base64url'),
    expected.length,
    COST
  );

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
