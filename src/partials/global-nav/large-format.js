import React, { useEffect } from "react";
import ArrowDownIcon from "components/icons/arrow-down";
import useUserProfile from "hooks/useUserProfile";
import analyticsService from "services/analyticsService";

export default ({ navOpen, setNavOpen, primary, secondary }) => {
  const userProfile = useUserProfile();

  useEffect(() => {
    const closeDropDown = (event) => {
      if (
        event.target.closest(".dropdown-menu") ||
        event.target.closest(".modal")
      ) {
        return;
      }
      setNavOpen(false);
    };

    document.body.addEventListener("click", closeDropDown);

    return () => document.body.removeEventListener("click", closeDropDown);
  }, [navOpen, setNavOpen]);

  const menuLinkClickHandler = (label) => () => {
    analyticsService.fireEvent("event-click", {
      clickedItemText: `Nav Account: ${label}`,
    });
    return null;
  };

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
                      onClick={menuLinkClickHandler(link.label)}
                      className={`link link--inherit ${className}`}
                      tabIndex={navOpen ? "0" : "-1"}
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
