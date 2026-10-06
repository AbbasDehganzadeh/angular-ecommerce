import { HttpError } from "./http.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalid = (field, rule) =>
  new HttpError(422, `Invalid '${field}': ${rule}`);

export function requireString(value, field, { min = 1, max = 255 } = {}) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length < min) {
    throw invalid(field, `expected at least ${min} characters`);
  }
  if (text.length > max) {
    throw invalid(field, `expected at most ${max} characters`);
  }
  return text;
}

export function optionalString(value, field, options) {
  if (value === undefined || value === null || value === "") return undefined;
  return requireString(value, field, options);
}

export function requireEmail(value, field = "email") {
  const email = requireString(value, field, { max: 254 }).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw invalid(field, "expected a valid email address");
  }
  return email;
}

export function requireNumber(value, field, { min = 0, max = 1e9 } = {}) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw invalid(field, "expected a number");
  }
  if (parsed < min || parsed > max) {
    throw invalid(field, `expected a value between ${min} and ${max}`);
  }
  return parsed;
}

export function requireInt(value, field, options) {
  const parsed = requireNumber(value, field, options);
  if (!Number.isInteger(parsed)) {
    throw invalid(field, "expected an integer");
  }
  return parsed;
}

export function requireId(value, field = "id") {
  return requireInt(value, field, { min: 1 });
}

export function requireArray(value, field, { max = 100 } = {}) {
  if (!Array.isArray(value)) {
    throw invalid(field, "expected an array");
  }
  if (value.length === 0) {
    throw invalid(field, "expected at least one item");
  }
  if (value.length > max) {
    throw invalid(field, `expected at most ${max} items`);
  }
  return value;
}
