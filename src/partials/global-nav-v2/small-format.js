import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExitIcon from "components/icons/exit";
import useUserProfile from "hooks/useUserProfile";
import MedicareCENTERLogo from "./assets/MedicareCENTER-Logo.svg";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";
import useRoles from "hooks/useRoles";
import Logo from "components/Logo";
const nonRTS_DisableLinks = ["MedicareAPP", "MedicareLINK"];

const SmallFormatNav = ({ navOpen, setNavOpen, primary, secondary, tertiary }) => {
    const userProfile = useUserProfile();

    const { isNonRTS_User } = useRoles();

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
            <button className="icon-btn global-nav-v2__mobile-trigger" onClick={() => setNavOpen(true)}>
                <span className="visually-hidden">Open Navigation Menu</span>
                <MenuIcon aria-hidden="true" className="text-white" fontSize="large" />
            </button>

            <nav className={`modal-nav ${navOpen ? "" : "visually-hidden"}`} style={navOpen ? {} : { width: 0 }}>
                <div className="modal-nav__header mb-4">
                    <button className="icon-btn modal-nav__exit-trigger" onClick={() => setNavOpen(false)}>
                        <span className="visually-hidden">Open Navigation Menu</span>
                        <ExitIcon aria-hidden="true" />
                    </button>
                </div>
                <div className="modal-nav__links modal-nav__links--primary">
                    <div className="modal-nav__hdg">
                        {capitalizeFirstLetter(userProfile?.firstName)} {capitalizeFirstLetter(userProfile?.lastName)}
                    </div>
                    <hr className="modal-nav__hr"></hr>
                    <ul>
                        {primary
                            .filter((link) => link.format !== "large")
                            .map((link, idx) => {
                                const { className = "", ...props } = link.props || {};

                                return (
                                    <li className="mt-3 ml-3" key={idx}>
                                        <link.component
                                            className={`link link--invert modal-nav__link ${className} linkAlignItems`}
                                            {...props}
                                        >
                                            {link.img && <img src={link.img} alt="linkIcon" className="iconImg" />}
                                            {link.label}
                                        </link.component>
                                    </li>
                                );
                            })}
                        <hr className="modal-nav__hr"></hr>
                        {secondary
                            .filter((link) => link.format !== "large")
                            .map((link, idx) => {
                                let { className = "", ...props } = link.props || {};
                                if (isNonRTS_User && nonRTS_DisableLinks.includes(link.label)) {
                                    className = `${className} disabledEvents`;
                                }

                                return (
                                    <li className="mt-3 ml-2" key={idx}>
                                        <link.component
                                            className={`link link--invert modal-nav__link ${className}`}
                                            {...props}
                                        >
                                            {link.label}
                                        </link.component>
                                    </li>
                                );
                            })}
                        <hr className="modal-nav__hr"></hr>
                        {tertiary
                            .filter((link) => link.format !== "large")
                            .map((link, idx) => {
                                const { className = "", ...props } = link.props || {};

                                return (
                                    <li className="mt-3 ml-3" key={idx}>
                                        <link.component
                                            className={`link link--invert modal-nav__link ${className} linkAlignItems`}
                                            {...props}
                                        >
                                            {link.img && <img src={link.img} alt="linkIcon" className="iconImg" />}
                                            {link.label}
                                        </link.component>
                                    </li>
                                );
                            })}
                    </ul>
                    <hr className="modal-nav__hr"></hr>
                    <Logo color="white" className="logoImg" />
                </div>
            </nav>
        </React.Fragment>
    );
};

export default SmallFormatNav;
