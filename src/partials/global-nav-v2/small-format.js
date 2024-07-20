import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MobileMenu from "./MobileMenu";

const SmallFormatNav = ({ navOpen, setNavOpen }) => {
    return (
        <React.Fragment>
            <button className="icon-btn global-nav-v2__mobile-trigger" onClick={() => setNavOpen(true)}>
                <span className="visually-hidden">Open Navigation Menu</span>
                <MenuIcon aria-hidden="true" className="text-white" fontSize="large" />
            </button>

            <nav className={`modal-nav ${navOpen ? "" : "visually-hidden"}`} style={navOpen ? {} : { width: 0 }}>
                <MobileMenu onClose={() => setNavOpen(false)} isOpen={navOpen} />
            </nav>
        </React.Fragment>
    );
};

export default SmallFormatNav;
