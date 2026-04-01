import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import { PortalDataProvider, usePortalData } from "../state/portalData.jsx";
import { useTheme } from "../state/theme.jsx";

function Brand() {
  return (
    <Link to="/app/home" className="navBrand">
      <span className="navBrandText">
        <span className="brandName">Buyer Portal</span>
        <span className="brandTag">Favourites</span>
      </span>
    </Link>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
      {label}
    </NavLink>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const { favourites } = usePortalData();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  return (
    <div className="profileWrap" ref={wrapperRef}>
      <button className="profileBtn" onClick={() => setOpen((v) => !v)} type="button">
        <span className="avatar" aria-hidden="true">
          {(user?.name || "U").slice(0, 1).toUpperCase()}
        </span>
        <span className="profileText">
          <span className="profileName">{user?.name || "User"}</span>
          <span className="profileMeta">
            {user?.role || "buyer"} • {favourites.length} fav
          </span>
        </span>
        <span className="caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div className="menu">
          <Link className="menuItem" to="/app/profile">
            Profile
          </Link>
          <Link className="menuItem" to="/app/favourites">
            My favourites
          </Link>
          <button
            className="menuItem danger"
            type="button"
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}

function LayoutInner() {
  const { error, notice, clearNotice } = usePortalData();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => clearNotice(), 2400);
    return () => clearTimeout(t);
  }, [notice, clearNotice]);

  return (
    <div className="appShell">
      <header className="nav">
        <div className="navInner">
          <Brand />
          <nav className="navLinks" aria-label="Primary">
            <NavItem to="/app/home" label="Home" />
            <NavItem to="/app/properties" label="All properties" />
            <NavItem to="/app/favourites" label="Favourites" />
            <NavItem to="/app/about" label="About" />
            <NavItem to="/app/profile" label="Profile" />
          </nav>
          <div className="navRight">
            <button
              className="iconBtn"
              type="button"
              onClick={toggle}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? "☀︎" : "☾"}
            </button>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="content">
        {error ? <div className="alert alertError">{error}</div> : null}
        {notice ? <div className="toast">{notice}</div> : null}
        <Outlet />
      </main>
    </div>
  );
}

export default function AppLayout() {
  return (
    <PortalDataProvider>
      <LayoutInner />
    </PortalDataProvider>
  );
}
