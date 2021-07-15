import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import MedicareCenterLogo from "../../images/medicare-center.png";
import "./index.scss";
import WelcomeHamburgerIcon from "../../../src/components/icons/welcome-hamburger";

export default () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <>
      <div className="public-nav">
        <h1 className="global-nav__title" data-gtm="nav-logo">
          <Link to="/welcome">
            <img
              src={MedicareCenterLogo}
              alt="Southwestern Legacy Insurance Group - Agent Portal logo"
            />
            <Logo aria-hidden="true" />
            <span className="visually-hidden">Medicare Center</span>
          </Link>
        </h1>
        <div className="link-wrapper">
          <Link to="/register">
            <span className="link">Register</span>
          </Link>
          <div className="seperator" />
          <Link to="/login">
            <span className="link">Login</span>
          </Link>
        </div>
      </div>
      <div className="mobile-menu-icon">
        <button
          className="icon-btn global-nav__mobile-trigger"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          <span className="visually-hidden">Open Navigation Menu</span>
          <WelcomeHamburgerIcon aria-hidden="true" />
        </button>
      </div>
      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="link-container">
            <Link to="/register">
              <span className="link-text">Login</span>
            </Link>
            <div className="seperator" />
            <Link to="/login">
              <span className="link-text">Register</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
