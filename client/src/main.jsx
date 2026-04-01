import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./state/auth.jsx";
import { ThemeProvider } from "./state/theme.jsx";
import "./styles.css";

try {
  const theme = localStorage.getItem("buyer_portal_theme") || "light";
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
} catch {
  // ignore
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
