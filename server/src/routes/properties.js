import express from "express";

export function propertiesRouter({ db }) {
  const router = express.Router();

  router.get("/", (_req, res) => {
    const properties = db.listProperties().map((p) => ({
      id: p.id,
      title: p.title,
      city: p.city,
      price: p.price,
      image: p.image
    }));
    res.json({ properties });
  });

  return router;
}
