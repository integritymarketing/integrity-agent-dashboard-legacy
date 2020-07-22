import React, { useEffect } from "react";
import ArrowDownIcon from "components/icons/arrow-down";

export default ({ navOpen, setNavOpen, primary, secondary }) => {
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
    <ul className="divided-hlist">
      {primary.map((link, idx) => {
        return (
          <li key={idx}>
            <link.component {...link.props}>{link.label}</link.component>
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
            className={`link dropdown-menu__trigger`}
            onClick={() => setNavOpen(!navOpen)}
          >
            <span>Rachel Swanson</span>
            <ArrowDownIcon />
          </button>
          <ul className="dropdown-menu__items">
            {secondary.map((link, idx) => {
              return (
                <li key={idx}>
                  <link.component {...link.props}>{link.label}</link.component>
                </li>
              );
            })}
          </ul>
        </div>
      </li>
    </ul>
  );
};
