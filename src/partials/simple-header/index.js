import React from "react";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import "./index.scss";

export default () => {
  return (
    <header className="simple-header mb-auto">
      <h1 className="simple-header__title">
        <Link to="/">
          <Logo />
        </Link>
      </h1>
    </header>
  );
};
