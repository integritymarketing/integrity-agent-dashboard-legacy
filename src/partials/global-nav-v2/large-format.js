import React, { useEffect, useState } from "react";

import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";

import useUserProfile from "hooks/useUserProfile";

import Arrow from "components/icons/down";

import "./index.scss";
import PlusMenu from "./plusMenu";

const LargeFormatNav = ({ navOpen, setNavOpen, primary, secondary }) => {
    const userProfile = useUserProfile();

    const [activedLink, setActivedLink] = useState("");

    useEffect(() => {
        window.location.pathname !== activedLink && setActivedLink(window.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname]);

    useEffect(() => {
        const closeDropDown = (event) => {
            if (event.target.closest(".dropdown-menu") || event.target.closest(".modal")) {
                return;
            }
            setNavOpen(false);
        };

        document.body.addEventListener("click", closeDropDown);

        return () => document.body.removeEventListener("click", closeDropDown);
    }, [navOpen, setNavOpen]);

    return (
        <div className="flex">
            <ul className="divided-hlist text-muted-light uiStyle">
                {primary
                    .filter((link) => link.format !== "small")
                    .map((link, idx) => {
                        const { className = "", ...props } = link.props || {};
                        return (
                            <li key={idx}>
                                <link.component
                                    className={`link link--invert ${className} ${activedLink.includes(props?.to) ? "link_active" : undefined
                                        }`}
                                    {...props}
                                >
                                    {link.label}
                                </link.component>
                            </li>
                        );
                    })}
                {
                    <li>
                        <div className={`dropdown-menu dropdown-menu--${navOpen ? "open" : "closed"}`}>
                            <button
                                className={`dropdown-menu__trigger button_color`}
                                onClick={() => setNavOpen(!navOpen)}
                            >
                                <span>
                                    {capitalizeFirstLetter(userProfile?.firstName)}{" "}
                                    {capitalizeFirstLetter(userProfile?.lastName)}
                                </span>
                                <Arrow color={"#FFFFFF"} className={navOpen ? "icon-flip" : ""} />
                            </button>
                            <ul className="dropdown-menu__items">
                                {secondary
                                    .filter((link) => link.format !== "small")
                                    .map((link, idx) => {
                                        let { className = "", ...props } = link.props || {};

                                        return (
                                            <li key={idx}>
                                                <link.component
                                                    className={`link link--inherit ${className} linkAlignItems ${props.class}`}
                                                    tabIndex={navOpen ? "0" : "-1"}
                                                    {...props}
                                                >
                                                    {link.img && <img src={link.img} alt="linkIcon" className="icon" />}
                                                    {link.label}
                                                </link.component>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </li>
                }
            </ul>
            <PlusMenu />
        </div>
    );
};

export default LargeFormatNav;
