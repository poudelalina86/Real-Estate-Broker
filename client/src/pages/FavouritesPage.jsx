import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePortalData } from "../state/portalData.jsx";
import PropertyCard from "../components/PropertyCard.jsx";

export default function FavouritesPage() {
  const { favourites, loading, removeFavourite } = usePortalData();

  const items = useMemo(() => favourites, [favourites]);

  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">My favourites</h1>
          <div className="muted">Only you can see and modify this list.</div>
        </div>
        <div className="pill">{loading ? "—" : `${items.length} saved`}</div>
      </div>

      {loading ? (
        <div className="card">
          <div className="skeletonLine w40" />
          <div className="skeletonLine" />
          <div className="skeletonLine" />
          <div className="skeletonLine" />
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="emptyTitle">No favourites yet</div>
            <div className="muted">Go to “All properties” and tap the heart icon.</div>
            <div style={{ marginTop: 12 }}>
              <Link className="btn btnPrimary" to="/app/properties">
                Browse properties
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="cardsGrid">
          {items.map((p) => (
            <PropertyCard
              key={p.id}
              p={p}
              liked={true}
              onToggleFavourite={(id) => removeFavourite(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
