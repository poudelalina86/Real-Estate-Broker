import React, { useMemo, useState } from "react";
import { usePortalData } from "../state/portalData.jsx";
import PropertyCard from "../components/PropertyCard.jsx";

export default function PropertiesPage() {
  const { properties, favourites, loading, addFavourite, removeFavourite } = usePortalData();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [city, setCity] = useState("all");
  const [onlySaved, setOnlySaved] = useState(false);

  const favouriteIds = useMemo(() => new Set(favourites.map((f) => f.id)), [favourites]);

  const cities = useMemo(() => {
    const uniq = new Set(properties.map((p) => p.city));
    return ["all", ...Array.from(uniq).sort((a, b) => a.localeCompare(b))];
  }, [properties]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = properties;
    if (city !== "all") list = list.filter((p) => p.city === city);
    if (onlySaved) list = list.filter((p) => favouriteIds.has(p.id));
    if (q) {
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)
      );
    }
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [properties, query, sort, city, onlySaved, favouriteIds]);

  async function onToggleFavourite(id, liked) {
    if (liked) await removeFavourite(id);
    else await addFavourite(id);
  }

  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">All properties</h1>
          <div className="muted">Search, sort, and save the ones you love.</div>
        </div>
        <div className="controls">
          <div className="inputWrap">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city or title…"
            />
          </div>
          <button
            className={onlySaved ? "btn btnSecondary isActive" : "btn btnSecondary"}
            type="button"
            onClick={() => setOnlySaved((v) => !v)}
            title="Show only favourites"
          >
            {onlySaved ? "Showing saved" : "Only saved"}
          </button>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
          </select>
        </div>
      </div>

      <div className="filterBar">
        <div className="filterLabel">City</div>
        <div className="chips">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              className={c === city ? "chipBtn active" : "chipBtn"}
              onClick={() => setCity(c)}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="pill">{loading ? "—" : `${filtered.length} results`}</div>
      </div>

      {loading ? (
        <div className="cardsGrid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="propertyCard skeletonCard" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="emptyTitle">No matches</div>
            <div className="muted">Try a different search term.</div>
          </div>
        </div>
      ) : (
        <div className="cardsGrid">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              p={p}
              liked={favouriteIds.has(p.id)}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
