import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.js";
import { useAuth } from "../state/auth.jsx";

export default function RegisterPage() {
  const nav = useNavigate();
  const { setAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/register", { body: { name, email, password } });
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
            <div className="brandTag">Create your account in seconds</div>
          </div>
        </div>

        <h1 className="h1">Register</h1>

        <form onSubmit={onSubmit} className="form">
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </label>
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </label>
          {error ? <div className="alert alertError">{error}</div> : null}
          <button className="btn btnPrimary" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="authFooter">
          <span className="muted">Have an account?</span> <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
