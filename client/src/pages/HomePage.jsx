import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import { usePortalData } from "../state/portalData.jsx";
import { formatNpr } from "../lib/money.js";

export default function HomePage() {
  const { user } = useAuth();
  const { properties, favourites, loading } = usePortalData();

  const recentFavourites = useMemo(() => favourites.slice(0, 3), [favourites]);

  return (
    <div className="stack">
      <div className="hero">
        <div>
          <div className="heroKicker">Welcome back</div>
          <h1 className="heroTitle">
            {user?.name}
            <span className="heroSubtitle">Manage your favourite properties in one place.</span>
          </h1>
          <div className="heroActions">
            <Link className="btn btnPrimary" to="/app/properties">
              Browse properties
            </Link>
            <Link className="btn btnSecondary" to="/app/favourites">
              View favourites
            </Link>
          </div>
        </div>
        <div className="stats">
          <div className="statCard">
            <div className="statLabel">Total properties</div>
            <div className="statValue">{loading ? "—" : properties.length}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">My favourites</div>
            <div className="statValue accent">{loading ? "—" : favourites.length}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Role</div>
            <div className="statValue">{user?.role || "buyer"}</div>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Recently favourited</h2>
              <div className="muted">Quick access to your latest saved listings.</div>
            </div>
            <Link className="pillLink" to="/app/favourites">
              Open
            </Link>
          </div>
          {recentFavourites.length === 0 ? (
            <div className="empty">
              <div className="emptyTitle">No favourites yet</div>
              <div className="muted">Browse properties and tap “Favourite”.</div>
              <div style={{ marginTop: 12 }}>
                <Link className="btn btnPrimary" to="/app/properties">
                  Browse properties
                </Link>
              </div>
            </div>
          ) : (
            <ul className="list">
              {recentFavourites.map((f) => (
                <li key={f.id} className="row">
                  <div className="rowMain">
                  <div className="rowTitle">{f.title}</div>
                  <div className="muted">
                    {f.city} • {formatNpr(f.price)}
                  </div>
                </div>
                <Link className="pillLink" to="/app/favourites">
                  Manage
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Tips</h2>
              <div className="muted">A few small touches that help.</div>
            </div>
          </div>
          <ul className="bullet">
            <li>Use search + filters in “All properties”.</li>
            <li>Favourites are private to your account.</li>
            <li>Log out from the profile menu anytime.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
