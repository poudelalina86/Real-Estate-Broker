import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api.js";
import { useAuth } from "./auth.jsx";

const PortalDataContext = createContext(null);

export function PortalDataProvider({ children }) {
  const { token, logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh({ quiet = false } = {}) {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const [p, f] = await Promise.all([
        apiFetch("/api/properties"),
        apiFetch("/api/favourites", { token })
      ]);
      setProperties(p.properties);
      setFavourites(f.favourites);
    } catch (err) {
      setError(err.message);
      if (err.status === 401) logout();
    } finally {
      if (!quiet) setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function addFavourite(propertyId) {
    setError("");
    setNotice("");
    try {
      await apiFetch("/api/favourites", { token, body: { propertyId } });
      setNotice("Added to favourites.");
      await refresh({ quiet: true });
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeFavourite(propertyId) {
    setError("");
    setNotice("");
    try {
      await apiFetch(`/api/favourites/${propertyId}`, { token, method: "DELETE" });
      setNotice("Removed from favourites.");
      await refresh({ quiet: true });
    } catch (err) {
      setError(err.message);
    }
  }

  const value = useMemo(
    () => ({
      properties,
      favourites,
      loading,
      error,
      notice,
      clearNotice: () => setNotice(""),
      refresh,
      addFavourite,
      removeFavourite
    }),
    [properties, favourites, loading, error, notice]
  );

  return <PortalDataContext.Provider value={value}>{children}</PortalDataContext.Provider>;
}

export function usePortalData() {
  const ctx = useContext(PortalDataContext);
  if (!ctx) throw new Error("usePortalData must be used within PortalDataProvider");
  return ctx;
}

