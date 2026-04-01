# Simple Buyer Portal (Favourites)

Minimal full-stack app for a real-estate buyer portal: email/password auth + per-user property favourites.

## Tech
- Backend: Node.js + Express + JSON-file DB, JWT auth
- Frontend: React (Vite) + React Router

## Run (dev)
1) Install backend deps
```bash
cd server
npm install
```

2) Install frontend deps
```bash
cd ../client
npm install 
```

3) Start backend (terminal 1)
```bash
cd ../server
npm run dev
```

4) Start frontend (terminal 2)
```bash
cd ../client
npm run dev
```

- API: `http://localhost:3001`
- Web: `http://localhost:5173` (proxies `/api` to the backend)

## Data
- DB file (auto-created): `server/data/db.json`
- Seeded properties: Nepal locations + prices (NPR)
- Property image used for all listings: `client/public/image.png` (served as `/image.png`)

## Routes (web)
- Public: `/login`, `/register`
- App (after login): `/app/home`, `/app/properties`, `/app/favourites`, `/app/about`, `/app/profile`
- UI: tap the heart icon to add/remove favourites (heart turns red when saved)

## Example flow
1) Register a user (web):
   - Go to `/register`, enter name/email/password
2) Login:
   - Go to `/login`, enter email/password
3) Add favourites:
   - Go to **All properties** and tap the heart icon
4) Remove favourites:
   - Go to **Favourites** tab and tap the heart icon again

## API (quick)
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/me` (requires `Authorization: Bearer <token>`)
- `GET /api/properties` (public)
- `GET /api/favourites` (auth)
- `POST /api/favourites` `{ propertyId }` (auth)
- `DELETE /api/favourites/:propertyId` (auth)

## Reset the seed data
If you want to reset the DB (users + favourites + seeded properties):
```bash
rm -f server/data/db.json
```
Then restart the backend.
