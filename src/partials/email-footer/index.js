import React from "react";

import FooterLogo from "./image.svg";
import "./index.scss";

const EmailFooter = () => {
    const currentDate = new Date().getFullYear();
    return (
        <footer className="footer-unauthenticated">
            <img className="logo" src={FooterLogo} alt="Integrity" />
            <div className="copyright pb-1">&copy;{currentDate} Integrity, All rights reserved.</div>
        </footer>
    );
};

export default EmailFooter;
