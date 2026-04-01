import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.js";
import { useAuth } from "../state/auth.jsx";

export default function LoginPage() {
  const nav = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", { body: { email, password } });
      setAuth(data);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page authPage">
      <div className="authCard">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div>
            <div className="brandName">Buyer Portal</div>
            <div className="brandTag">Sign in to manage your favourites</div>
          </div>
        </div>

        <h1 className="h1">Login</h1>

        <form onSubmit={onSubmit} className="form">
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              required
            />
          </label>
          {error ? <div className="alert alertError">{error}</div> : null}
          <button className="btn btnPrimary" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="authFooter">
          <span className="muted">No account?</span> <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
