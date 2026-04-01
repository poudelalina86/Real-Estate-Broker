import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { openDb, initDb } from "./db.js";
import { notFound, errorHandler } from "./errors.js";
import { authRouter } from "./routes/auth.js";
import { favouritesRouter } from "./routes/favourites.js";
import { meRouter } from "./routes/me.js";
import { propertiesRouter } from "./routes/properties.js";

const db = openDb();
initDb(db);

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter({ db }));
app.use("/api/me", meRouter());
app.use("/api/properties", propertiesRouter({ db }));
app.use("/api/favourites", favouritesRouter({ db }));

if (config.isProd) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
