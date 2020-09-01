import React, { useEffect } from "react";
import ArrowDownIcon from "components/icons/arrow-down";
import useUserProfile from "hooks/useUserProfile";

export default ({ navOpen, setNavOpen, primary, secondary }) => {
  const userProfile = useUserProfile();

  useEffect(() => {
    const closeDropDown = (event) => {
      if (event.target.closest(".dropdown-menu")) {
        return;
      }
      setNavOpen(false);
    };

    document.body.addEventListener("click", closeDropDown);

    return () => document.body.removeEventListener("click", closeDropDown);
  }, [navOpen, setNavOpen]);

  return (
    <ul className="divided-hlist text-muted-light">
      {primary
        .filter((link) => link.format !== "small")
        .map((link, idx) => {
          const { className = "", ...props } = link.props || {};
          return (
            <li key={idx}>
              <link.component
                className={`link link--invert ${className}`}
                {...props}
              >
                {link.label}
              </link.component>
            </li>
          );
        })}
      <li>
        <div
          className={`dropdown-menu dropdown-menu--${
            navOpen ? "open" : "closed"
          }`}
        >
          <button
            className={`link link--inherit dropdown-menu__trigger`}
            onClick={() => setNavOpen(!navOpen)}
          >
            <span>{userProfile.fullName}</span>
            <ArrowDownIcon className={navOpen ? "icon-flip" : ""} />
          </button>
          <ul className="dropdown-menu__items">
            {secondary
              .filter((link) => link.format !== "small")
              .map((link, idx) => {
                const { className = "", ...props } = link.props || {};
                return (
                  <li key={idx}>
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
      </li>
    </ul>
  );
};
