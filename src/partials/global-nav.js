import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "contexts/auth";
import "./global-nav.scss";

export default () => {
  const auth = useContext(AuthContext);

  return (
    <header className="global-nav">
      <h1 className="global-nav__title">Agent Portal</h1>
      <nav className="global-nav__links">
        {auth.isAuthenticated ? (
          <ul>
            <li>
              <Link to="/" className="link link--invert">
                Home
              </Link>
            </li>
            <li>
              <Link to="/training" className="link link--invert">
                Training
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => auth.signout()}
                className="link link--invert"
              >
                Sign Out
              </button>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/login" className="link link--invert">
                Login
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};
