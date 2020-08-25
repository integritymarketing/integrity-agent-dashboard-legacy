import React from "react";
import "./index.scss";

export default ({ className = "", ...props }) => {
  return (
    <footer className={`simple-footer pt-5 ${className}`} {...props}>
      <div className="simple-footer__content sf-text-center">
        <nav className="simple-footer__links">
          <ul className="divided-hlist">
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/terms`}
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/privacy`}
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </nav>
        <small className="simple-footer__legal">
          <span>Copyright © 2020</span> <span>Integrity Marketing Group.</span>{" "}
          <span>All rights reserved.</span>
        </small>
      </div>
    </footer>
  );
};
