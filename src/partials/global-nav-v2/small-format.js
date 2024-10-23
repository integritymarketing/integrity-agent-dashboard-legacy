import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MobileMenu from "./MobileMenu";
import PlusMenu from "./plusMenu";

const SmallFormatNav = ({ navOpen, setNavOpen, page }) => {
    return (
        <React.Fragment>
            <div
                className={`${
                    page === "taskListMobileLayout"
                        ? "global-nav-v2__taskList-mobile flex"
                        : "global-nav-v2__mobile-trigger flex"
                }`}
            >
                <PlusMenu />
                <button className="icon-btn" onClick={() => setNavOpen(true)}>
                    <span className="visually-hidden">Open Navigation Menu</span>
                    <MenuIcon aria-hidden="true" className="text-white" fontSize="large" />
                </button>
            </div>

            <nav className={`modal-nav ${navOpen ? "" : "visually-hidden"}`} style={navOpen ? {} : { width: 0 }}>
                <MobileMenu onClose={() => setNavOpen(false)} isOpen={navOpen} />
            </nav>
        </React.Fragment>
    );
};

export default SmallFormatNav;
