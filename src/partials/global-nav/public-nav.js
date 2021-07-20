import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "partials/logo";
import MedicareCenterLogo from "../../images/medicare-center.png";
import "./index.scss";
import WelcomeHamburgerIcon from "../../../src/components/icons/welcome-hamburger";
import LoginLink from "components/ui/login-link";
import ExitIcon from "components/icons/exit";

export const RegisterLink = (props) => {
  return (
    <a href={`${process.env.REACT_APP_AUTH_BASE_URL}/register`} {...props}>
      {props.children}
    </a>
  );
};

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
          <LoginLink>
            <span className="link">Login</span>
          </LoginLink>
          <div className="seperator" />
          <RegisterLink>
            <span className="link">Register</span>
          </RegisterLink>
        </div>
      </div>
      <div className="mobile-menu-icon">
        <button
          className="icon-btn global-nav__mobile-trigger"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          <span className="visually-hidden">Open Navigation Menu</span>
          {showMobileMenu ? (
            <ExitIcon aria-hidden="true" />
          ) : (
            <WelcomeHamburgerIcon aria-hidden="true" />
          )}
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
