import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "buyer_portal_theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark"))
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
