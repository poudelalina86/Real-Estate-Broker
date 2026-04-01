import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

function nowIso() {
  return new Date().toISOString();
}

function ensureDbDir(dbPath) {
  const dir = path.dirname(dbPath);
  fs.mkdirSync(dir, { recursive: true });
}

function defaultData() {
  const commonImage = "/image.png";
  const seededProperties = [
    {
      id: 1,
      title: "2BHK Apartment, Baluwatar",
      city: "Kathmandu",
      price: 16500000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 2,
      title: "Modern House, Budhanilkantha",
      city: "Kathmandu",
      price: 42000000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 3,
      title: "Family Home, Jhamsikhel",
      city: "Lalitpur",
      price: 35500000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 4,
      title: "Lakeview Apartment, Lakeside",
      city: "Pokhara",
      price: 18500000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 5,
      title: "Land Plot, Suryabinayak",
      city: "Bhaktapur",
      price: 12500000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 6,
      title: "Bungalow, Bharatpur",
      city: "Chitwan",
      price: 27500000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 7,
      title: "City Apartment, Butwal",
      city: "Butwal",
      price: 9800000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 8,
      title: "Riverside Home, Dharan",
      city: "Dharan",
      price: 14900000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 9,
      title: "Townhouse, Biratnagar",
      city: "Biratnagar",
      price: 17900000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 10,
      title: "Family Home, Hetauda",
      city: "Hetauda",
      price: 13200000,
      image: commonImage,
      created_at: nowIso()
    },
    {
      id: 11,
      title: "Commercial Flat, Nepalgunj",
      city: "Nepalgunj",
      price: 15600000,
      image: commonImage,
      created_at: nowIso()
    }
  ];

  return {
    seedVersion: 2,
    nextUserId: 1,
    nextPropertyId: seededProperties.length + 1,
    users: [],
    properties: seededProperties,
    favourites: []
  };
}

function normalizeLoadedData(loaded) {
  const data = loaded && typeof loaded === "object" ? loaded : defaultData();
  if (!Array.isArray(data.users)) data.users = [];
  if (!Array.isArray(data.properties)) data.properties = [];
  if (!Array.isArray(data.favourites)) data.favourites = [];

  const ensureSeedImages = () => {
    const seededMap = new Map(defaultData().properties.map((p) => [p.id, p.image]));
    data.properties = data.properties.map((p) => {
      const id = Number(p?.id);
      const seedImage = seededMap.get(id);
      if (!seedImage) return p; // don't touch non-seeded/custom properties
      if (p?.image === seedImage) return p;
      return { ...p, image: seedImage };
    });
  };

  const maxUserId = data.users.reduce((m, u) => Math.max(m, Number(u.id) || 0), 0);
  const maxPropertyId = data.properties.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
  data.nextUserId = Math.max(Number(data.nextUserId) || 1, maxUserId + 1);
  data.nextPropertyId = Math.max(Number(data.nextPropertyId) || 1, maxPropertyId + 1);

  if (data.properties.length === 0) {
    const seeded = defaultData();
    data.properties = seeded.properties;
    data.nextPropertyId = seeded.nextPropertyId;
  } else {
    const looksLikeOldSeed =
      data.properties.length === 4 &&
      data.properties.some((p) => p?.title === "Sunny 2BR Apartment") &&
      data.properties.some((p) => p?.city === "Austin");
    if (looksLikeOldSeed) {
      const seeded = defaultData();
      data.properties = seeded.properties;
      data.nextPropertyId = seeded.nextPropertyId;
      data.seedVersion = seeded.seedVersion;
    }

    const looksLikeNepalSeedV1 =
      (Number(data.seedVersion) || 0) < 2 &&
      data.properties.length === 6 &&
      data.properties.some((p) => p?.title === "2BHK Apartment, Baluwatar") &&
      data.properties.some((p) => p?.city === "Pokhara");
    if (looksLikeNepalSeedV1) {
      const seeded = defaultData();
      data.properties = seeded.properties;
      data.nextPropertyId = seeded.nextPropertyId;
      data.seedVersion = seeded.seedVersion;
    }

    ensureSeedImages();
  }

  return data;
}

export function openDb() {
  ensureDbDir(config.dbPath);
  if (!fs.existsSync(config.dbPath)) {
    fs.writeFileSync(config.dbPath, JSON.stringify(defaultData(), null, 2));
  }
  const raw = fs.readFileSync(config.dbPath, "utf8");
  const loaded = raw ? JSON.parse(raw) : null;
  const data = normalizeLoadedData(loaded);

  const db = {
    _path: config.dbPath,
    _data: data,
    save() {
      fs.writeFileSync(db._path, JSON.stringify(db._data, null, 2));
    },

    findUserByEmail(email) {
      return db._data.users.find((u) => u.email === email) ?? null;
    },
    findUserById(id) {
      return db._data.users.find((u) => u.id === id) ?? null;
    },
    createUser({ name, email, password_hash, role = "buyer" }) {
      const user = {
        id: db._data.nextUserId++,
        name,
        email,
        password_hash,
        role,
        created_at: nowIso()
      };
      db._data.users.push(user);
      db.save();
      return user;
    },

    listProperties() {
      return [...db._data.properties].sort((a, b) => a.id - b.id);
    },
    propertyExists(id) {
      return db._data.properties.some((p) => p.id === id);
    },
    getProperty(id) {
      return db._data.properties.find((p) => p.id === id) ?? null;
    },

    listFavourites(userId) {
      const favs = db._data.favourites
        .filter((f) => f.user_id === userId)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      return favs
        .map((f) => {
          const p = db.getProperty(f.property_id);
          if (!p) return null;
          return {
            id: p.id,
            title: p.title,
            city: p.city,
            price: p.price,
            image: p.image,
            favourited_at: f.created_at
          };
        })
        .filter(Boolean);
    },
    addFavourite(userId, propertyId) {
      const exists = db._data.favourites.some(
        (f) => f.user_id === userId && f.property_id === propertyId
      );
      if (exists) return false;
      db._data.favourites.push({ user_id: userId, property_id: propertyId, created_at: nowIso() });
      db.save();
      return true;
    },
    removeFavourite(userId, propertyId) {
      const before = db._data.favourites.length;
      db._data.favourites = db._data.favourites.filter(
        (f) => !(f.user_id === userId && f.property_id === propertyId)
      );
      const changed = before !== db._data.favourites.length;
      if (changed) db.save();
      return changed;
    }
  };

  return db;
}

export function initDb(_db) {
  // No-op for JSON DB. Kept for compatibility with the server bootstrap.
}
