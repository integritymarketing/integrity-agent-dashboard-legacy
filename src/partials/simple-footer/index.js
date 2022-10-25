import React from "react";
import "./index.scss";
import usePortalUrl from "hooks/usePortalUrl";
import MCLogo from "images/mc-logo.svg";

export default ({ className = "", mobileAppLogin, loginPage, ...props }) => {
  const portalUrl = usePortalUrl();
  return (
    <footer className={`simple-footer pt-5 ${className}`} {...props}>
      <div className="simple-footer__content sf-text-center">
        <nav className="simple-footer__links">
          <ul className="divided-hlist">
            {!mobileAppLogin && (
              <>
                <li>
                  <a
                    href={`${portalUrl || ""}/terms`}
                    rel="noopener noreferrer"
                    className="link link--inherit"
                  >
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href={`${portalUrl || ""}/privacy`}
                    rel="noopener noreferrer"
                    className="link link--inherit"
                  >
                    Privacy Policy
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
        <small className="simple-footer__legal">
          {loginPage && (
            <span className="integrity-logo">
              <img
                src={MCLogo}
                alt="Medicare Center Logo"
                className="mc-img"
              ></img>
            </span>
          )}
          <span>&copy; {new Date().getFullYear()}</span> <span>Integrity.</span>{" "}
          <span>All rights reserved.</span>
        </small>
      </div>
    </footer>
  );
};
