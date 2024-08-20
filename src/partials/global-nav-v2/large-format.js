import React, { useEffect, useState } from "react";

import "./index.scss";

const LargeFormatNav = ({ navOpen, setNavOpen, primary }) => {
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
            </ul>
        </div>
    );
};

export default LargeFormatNav;
