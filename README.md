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
- Web: `http://localhost:5173` 




## Example flow
1) Register a user (web):
   - Go to `/register`, enter name/email/password
2) Login:
   - Go to `/login`, enter email/password
3) Add favourites:
   - On Dashboard, click **Add to favourites** on a property
4) Remove favourites:
   - Click **Remove** in “My Favourites”

## API (quick)
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/me` (requires `Authorization: Bearer <token>`)
- `GET /api/properties` (public)
- `GET /api/favourites` (auth)
- `POST /api/favourites` `{ propertyId }` (auth)
- `DELETE /api/favourites/:propertyId` (auth)
