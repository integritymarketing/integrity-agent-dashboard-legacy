import React from "react";
import { Link } from "react-router-dom";
import "./global-footer.scss";

export default () => {
  return (
    <footer className="global-footer pt-scale-1">
      <div className="global-footer__content">
        <nav className="global-footer__links">
          <ul className="divided-hlist">
            <li>
              <Link to="/terms" className="link link--invert">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="link link--invert">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>
        <small>
          Copyright © 2020 Integrity Marketing Group. All rights reserved.
        </small>
      </div>
    </footer>
  );
};
