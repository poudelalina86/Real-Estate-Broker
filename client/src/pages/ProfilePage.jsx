import React from "react";
import { useAuth } from "../state/auth.jsx";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Profile</h1>
          <div className="muted">Account details for this session.</div>
        </div>
      </div>

      <div className="card">
        <div className="profileGrid">
          <div className="profilePanel">
            <div className="avatar lg" aria-hidden="true">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="profileNameLg">{user?.name || "User"}</div>
              <div className="muted">{user?.email}</div>
              <div style={{ marginTop: 10 }}>
                <span className="chip">{user?.role || "buyer"}</span>
              </div>
            </div>
          </div>

          <div className="profilePanel">
            <div className="proseTitle">What you can do</div>
            <ul className="bullet">
              <li>Browse properties</li>
              <li>Add/remove your favourites</li>
              <li>Only access your own data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

