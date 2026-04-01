import { httpError } from "./errors.js";

export function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function requireString(body, key, { min = 1, max = 200 } = {}) {
  const value = body?.[key];
  if (typeof value !== "string") throw httpError(400, `Missing field: ${key}`);
  const trimmed = value.trim();
  if (trimmed.length < min) throw httpError(400, `${key} must be at least ${min} chars`);
  if (trimmed.length > max) throw httpError(400, `${key} must be at most ${max} chars`);
  return trimmed;
}

export function requireInt(body, key) {
  const value = body?.[key];
  const num = Number(value);
  if (!Number.isInteger(num)) throw httpError(400, `${key} must be an integer`);
  return num;
}

