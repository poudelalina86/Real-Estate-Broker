import React from "react";

export default function AboutPage() {
  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">About</h1>
          <div className="muted">A tiny buyer portal demo (auth + favourites).</div>
        </div>
      </div>

      <div className="card">
        <div className="prose">
          <p>
            This app demonstrates a simple full-stack flow: register/login with email + password, then
            save properties to a per-user favourites list.
          </p>
          <p className="muted">
            Security note: passwords are hashed, and favourites are always scoped to the authenticated
            user on the server.
          </p>
          <div className="divider" />
          <div className="proseGrid">
            <div>
              <div className="proseTitle">Backend</div>
              <ul className="bullet">
                <li>Express API with JWT auth</li>
                <li>Validation + consistent JSON errors</li>
                <li>Simple file-backed DB</li>
              </ul>
            </div>
            <div>
              <div className="proseTitle">Frontend</div>
              <ul className="bullet">
                <li>React + Router</li>
                <li>Navbar + profile menu</li>
                <li>Premium UI with search/sort</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

