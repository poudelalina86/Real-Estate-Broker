import express from "express";
import bcrypt from "bcryptjs";
import { httpError } from "../errors.js";
import { signToken } from "../auth.js";
import { isEmail, requireString } from "../validation.js";

export function authRouter({ db }) {
  const router = express.Router();

  router.post("/register", (req, res, next) => {
    try {
      const name = requireString(req.body, "name", { min: 2, max: 80 });
      const emailRaw = requireString(req.body, "email", { min: 5, max: 200 });
      const password = requireString(req.body, "password", { min: 8, max: 200 });

      const email = emailRaw.toLowerCase();
      if (!isEmail(email)) throw httpError(400, "Invalid email");

      const existing = db.findUserByEmail(email);
      if (existing) throw httpError(409, "Email already registered");

      const password_hash = bcrypt.hashSync(password, 12);
      const created = db.createUser({ name, email, password_hash, role: "buyer" });
      const user = { id: created.id, name: created.name, email: created.email, role: created.role };

      const token = signToken(user);
      res.status(201).json({ user, token });
    } catch (e) {
      next(e);
    }
  });

  router.post("/login", (req, res, next) => {
    try {
      const emailRaw = requireString(req.body, "email", { min: 5, max: 200 });
      const password = requireString(req.body, "password", { min: 1, max: 200 });
      const email = emailRaw.toLowerCase();
      if (!isEmail(email)) throw httpError(400, "Invalid email");

      const userRow = db.findUserByEmail(email);
      if (!userRow) throw httpError(401, "Invalid email or password");

      const ok = bcrypt.compareSync(password, userRow.password_hash);
      if (!ok) throw httpError(401, "Invalid email or password");

      const user = { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role };
      const token = signToken(user);
      res.json({ user, token });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
