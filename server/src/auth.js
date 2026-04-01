import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { httpError } from "./errors.js";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
}

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization ?? "";
  const [, token] = header.split(" ");
  if (!token) return next(httpError(401, "Missing Authorization Bearer token"));

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name,
      role: payload.role
    };
    next();
  } catch {
    next(httpError(401, "Invalid or expired token"));
  }
}

