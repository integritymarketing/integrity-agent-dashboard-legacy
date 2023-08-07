import React, { useEffect, useState } from "react";
import Arrow from "components/icons/down";
import useUserProfile from "hooks/useUserProfile";
import { useHistory } from "react-router-dom";
import useRoles from "hooks/useRoles";
import "./index.scss";

const nonRTS_DisableLinks = ["LeadCENTER", "MedicareAPP", "MedicareLINK"];

const LargeFormatNav = ({ navOpen, setNavOpen, primary, secondary }) => {
  const userProfile = useUserProfile();

  const history = useHistory();
  const [activedLink, setActivedLink] = useState("");

  const { isNonRTS_User } = useRoles();

  const nonRTS_Props = {
    disabled: true,
    class: "disabledCursor",
    title:
      "It looks like you do not have the proper access or ready-to-sell information present. If you feel this is in error, please reach out to your Marketer or contact support.",
  };

  useEffect(() => {
    history?.location?.pathname !== activedLink &&
      setActivedLink(history.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);

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

  return (
    <ul className="divided-hlist text-muted-light uiStyle">
      {primary
        .filter((link) => link.format !== "small")
        .map((link, idx) => {
          const { className = "", ...props } = link.props || {};
          return (
            <li key={idx}>
              <link.component
                className={`link link--invert ${className} ${
                  activedLink.includes(props?.to) ? "link_active" : undefined
                }`}
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
            className={`dropdown-menu__trigger button_color`}
            onClick={() => setNavOpen(!navOpen)}
          >
            <span>{userProfile.fullName}</span>
            <Arrow color={"#FFFFFF"} className={navOpen ? "icon-flip" : ""} />
          </button>
          <ul className="dropdown-menu__items">
            {secondary
              .filter((link) => link.format !== "small")
              .map((link, idx) => {
                let { className = "", ...props } = link.props || {};
                if (isNonRTS_User && nonRTS_DisableLinks.includes(link.label)) {
                  props = { ...props, ...nonRTS_Props };
                }
                return (
                  <li key={idx}>
                    <link.component
                      className={`link link--inherit ${className} linkAlignItems ${props.class}`}
                      tabIndex={navOpen ? "0" : "-1"}
                      {...props}
                    >
                      {link.img && (
                        <img src={link.img} alt="linkIcon" className="icon" />
                      )}
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

export default LargeFormatNav;