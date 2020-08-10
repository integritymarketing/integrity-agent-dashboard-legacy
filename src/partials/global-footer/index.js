import React from "react";
import "./index.scss";

export default ({ className = "", ...props }) => {
  return (
    <footer className={`global-footer pt-5 ${className}`} {...props}>
      <div className="global-footer__content sf-text-center">
        <nav className="global-footer__links">
          <ul className="divided-hlist">
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/terms`}
                target="_blank"
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href={`${process.env.REACT_APP_PORTAL_URL || ""}/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="link link--inherit"
              >
                Privacy Policy
              </a>
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
