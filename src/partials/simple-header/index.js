import React from "react";
import { Link } from "react-router-dom";
import usePortalUrl from "hooks/usePortalUrl";
import Logo from "partials/logo";
import "./index.scss";

export default () => {
  const portalUrl = usePortalUrl();
  const isLifeCenter = portalUrl.includes("southwesternlegacy");

  return (
    <header className="simple-header mb-auto">
      <h1 className="simple-header__title">
        <Link to="/">
          <Logo aria-hidden="true" isLifeCenter={isLifeCenter} />
          <span className="visually-hidden">
            {isLifeCenter
              ? "Southwestern Legacy Insurance Group – Agent Portal"
              : "Medicare Center"}
          </span>
        </Link>
      </h1>
    </header>
  );
};
