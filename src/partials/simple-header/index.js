import React from "react";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import "./index.scss";

export default ({ id }) => {
  return (
    <header className="simple-header mb-auto">
      <h1 className="simple-header__title">
        <Link to="/">
          <Logo aria-hidden="true" />
          <span className="visually-hidden">Medicare Center</span>
        </Link>
      </h1>
    </header>
  );
};
