import { config } from "../config.js";
import { findById, toPublicUser } from "../models/user.model.js";
import { signToken, verifyToken } from "../utils/token.js";
import { unauthorized } from "../utils/http.js";

function readToken(req) {
  const header = req.headers.authorization ?? "";
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  const cookies = (req.headers.cookie ?? "")
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean);

  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name === config.cookieName) return decodeURIComponent(rest.join("="));
  }

  return null;
}

function appendCookie(res, value, maxAge) {
  const parts = [
    `${config.cookieName}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function issueSession(res, user) {
  const token = signToken(
    { sub: user.id, username: user.username },
    config.tokenSecret,
    config.tokenTtlSeconds,
  );
  appendCookie(res, token, config.tokenTtlSeconds);
  return token;
}

export function clearSession(res) {
  appendCookie(res, "", 0);
}

export function authenticate(ctx) {
  const token = readToken(ctx.req);
  ctx.user = null;

  if (!token) return;

  const payload = verifyToken(token, config.tokenSecret);
  if (!payload) return;

  const row = findById(ctx.db, payload.sub);
  if (row) ctx.user = toPublicUser(row);
}

export function requireAuth(ctx) {
  if (!ctx.user) throw unauthorized();
  return ctx.user;
}
