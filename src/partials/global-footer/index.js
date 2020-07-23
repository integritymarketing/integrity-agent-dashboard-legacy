import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

export default () => {
  return (
    <footer className="global-footer pt-5">
      <div className="global-footer__content sf-text-center">
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
        <small className="global-footer__legal">
          <span>Copyright © 2020</span> <span>Integrity Marketing Group.</span>{" "}
          <span>All rights reserved.</span>
        </small>
      </div>
    </footer>
  );
};
