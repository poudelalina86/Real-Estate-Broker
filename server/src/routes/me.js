import express from "express";
import { requireAuth } from "../auth.js";

export function meRouter() {
  const router = express.Router();
  router.get("/", requireAuth, (req, res) => {
    res.json({ user: req.user });
  });
  return router;
}

