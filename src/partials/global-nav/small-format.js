import React, { useEffect } from "react";
import HamburgerIcon from "components/icons/hamburger";
import ExitIcon from "components/icons/exit";
import useUserProfile from "hooks/useUserProfile";

export default ({ navOpen, setNavOpen, primary, secondary }) => {
  const userProfile = useUserProfile();

  useEffect(() => {
    document.body.classList.toggle("disable-scroll", navOpen);

    return () => document.body.classList.remove("disable-scroll");
  }, [navOpen]);
  useEffect(() => {
    const closeDropDown = (event) => {
      if (!event.target.closest(".link")) {
        return;
      }
      setNavOpen(false);
    };

    document.body.addEventListener("click", closeDropDown);

    return () => document.body.removeEventListener("click", closeDropDown);
  }, [navOpen, setNavOpen]);

  return (
    <React.Fragment>
      <button
        className="icon-btn global-nav__mobile-trigger"
        onClick={() => setNavOpen(true)}
      >
        <span className="visually-hidden">Open Navigation Menu</span>
        <HamburgerIcon aria-hidden="true" />
      </button>

      <nav className={`modal-nav ${navOpen ? "" : "visually-hidden"}`}>
        <div className="modal-nav__header mb-4">
          <span>Menu</span>
          <button
            className="icon-btn modal-nav__exit-trigger"
            onClick={() => setNavOpen(false)}
          >
            <span className="visually-hidden">Open Navigation Menu</span>
            <ExitIcon aria-hidden="true" />
          </button>
        </div>
        <div className="modal-nav__links modal-nav__links--primary">
          <div className="modal-nav__hdg">
            <span>{userProfile.fullName}</span>
          </div>
          <ul>
            {primary
              .filter((link) => link.format !== "large")
              .map((link, idx) => {
                const { className = "", ...props } = link.props || {};
                return (
                  <li className="mt-3" key={idx}>
                    <link.component
                      className={`link link--invert ${className}`}
                      {...props}
                    >
                      {link.label}
                    </link.component>
                  </li>
                );
              })}
            {secondary
              .filter((link) => link.format !== "large")
              .map((link, idx) => {
                const { className = "", ...props } = link.props || {};
                return (
                  <li className="mt-3" key={idx}>
                    <link.component
                      className={`link link--invert ${className}`}
                      {...props}
                    >
                      {link.label}
                    </link.component>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="modal-nav__links modal-nav__links--secondary pt-4">
          <div className="modal-nav__hdg">Need Help?</div>
          <ul>
            <li className="mt-3">
              <a href="tel:+1-651-555-1234" className="link link--invert">
                Call Support
              </a>
            </li>
            <li className="mt-3">
              <a
                href="mailto:support@medicarecenter.com"
                className="link link--invert"
              >
                Email Support
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};
