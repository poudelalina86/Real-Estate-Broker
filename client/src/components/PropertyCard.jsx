import React from "react";
import { formatNpr } from "../lib/money.js";

function HeartIcon({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 21s-7.2-4.4-9.6-9.1C.8 8.8 2.5 5.7 5.7 5.1c1.8-.3 3.5.4 4.6 1.7 1.1-1.3 2.8-2 4.6-1.7 3.2.6 4.9 3.7 3.3 6.8C19.2 16.6 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PropertyCard({ p, liked, onToggleFavourite }) {
  return (
    <div className="propertyCard">
      <div className="propertyMedia">
        {p.image ? (
          <img className="propertyImg" src={p.image} alt={`${p.title} in ${p.city}`} loading="lazy" />
        ) : (
          <div className="propertyImgPlaceholder" aria-hidden="true" />
        )}
        <button
          className={liked ? "heartBtn liked" : "heartBtn"}
          type="button"
          onClick={() => onToggleFavourite(p.id, liked)}
          title={liked ? "Remove from favourites" : "Add to favourites"}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      <div className="propertyBody">
        <div className="propertyTitle">{p.title}</div>
        <div className="propertyMeta">
          <span className="tag">{p.city}</span>
          <span className="tag price">{formatNpr(p.price)}</span>
        </div>
      </div>
    </div>
  );
}
