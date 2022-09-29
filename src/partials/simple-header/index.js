import React from "react";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import "./index.scss";

export default (mobileAppLogin) => {
  console.log("mobileAppLoginLink", mobileAppLogin)
  return (
    <header className="simple-header mb-auto">
      <h1 className="simple-header__title">
        {!mobileAppLogin ? (
          <Link to="/">
            <Logo aria-hidden="true" id="footerLogo" />
            <span className="visually-hidden">Medicare Center</span>
          </Link>
        ) : (
          <>
            {" "}
            <Logo aria-hidden="true" id="footerLogo" />
            <span className="visually-hidden">Medicare Center</span>
          </>
        )}
      </h1>
    </header>
  );
};
