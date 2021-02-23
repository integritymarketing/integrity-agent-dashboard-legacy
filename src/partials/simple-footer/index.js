import React from "react";
import "./index.scss";
import usePortalUrl from "hooks/usePortalUrl";

export default ({ className = "", ...props }) => {
  const portalUrl = usePortalUrl();
  const isLifeCenter = portalUrl.includes("southwesternlegacy");

  return (
    <footer className={`simple-footer pt-5 ${className}`} {...props}>
      <div className="simple-footer__content sf-text-center">
        <nav className="simple-footer__links">
          <ul className="divided-hlist">
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
          </ul>
        </nav>
        <small className="simple-footer__legal">
          <span>&copy; {new Date().getFullYear()}</span>{" "}
          <span>
            {isLifeCenter
              ? "Southwestern Legacy Insurance Group."
              : "Integrity Marketing Group."}
          </span>{" "}
          <span>All rights reserved.</span>
        </small>
      </div>
    </footer>
  );
};
