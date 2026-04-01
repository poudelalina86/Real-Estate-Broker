import express from "express";
import { requireAuth } from "../auth.js";
import { httpError } from "../errors.js";
import { requireInt } from "../validation.js";

export function favouritesRouter({ db }) {
  const router = express.Router();

  router.get("/", requireAuth, (req, res) => {
    const favourites = db.listFavourites(req.user.id);

    res.json({ favourites });
  });

  router.post("/", requireAuth, (req, res, next) => {
    try {
      const propertyId = requireInt(req.body, "propertyId");

      if (!db.propertyExists(propertyId)) throw httpError(404, "Property not found");
      db.addFavourite(req.user.id, propertyId);

      res.status(201).json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:propertyId", requireAuth, (req, res, next) => {
    try {
      const propertyId = Number(req.params.propertyId);
      if (!Number.isInteger(propertyId)) throw httpError(400, "propertyId must be an integer");

      const changed = db.removeFavourite(req.user.id, propertyId);
      if (!changed) throw httpError(404, "Favourite not found");
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
