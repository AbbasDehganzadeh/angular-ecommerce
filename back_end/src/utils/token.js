import { createHmac, timingSafeEqual } from "node:crypto";

const encode = (value) => Buffer.from(value).toString("base64url");

const sign = (body, secret) =>
  createHmac("sha256", secret).update(body).digest("base64url");

export function signToken(payload, secret, ttlSeconds) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const body = encode(
    JSON.stringify({ ...payload, iat: issuedAt, exp: issuedAt + ttlSeconds }),
  );
  return `${body}.${sign(body, secret)}`;
}

export function verifyToken(token, secret) {
  if (typeof token !== "string") return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const provided = Buffer.from(signature);
  const expected = Buffer.from(sign(body, secret));
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000))
      return null;
    return payload;
  } catch {
    return null;
  }
}
