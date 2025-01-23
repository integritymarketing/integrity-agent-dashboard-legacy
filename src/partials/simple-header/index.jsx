import React from "react";
import { Link } from "react-router-dom";

import Logo from "partials/logo";

import "./index.scss";

const SimpleHeader = (mobileAppLogin) => {
    return (
        <header className="simple-header">
            <h1 className="simple-header__title">
                {!mobileAppLogin ? (
                    <Link to="/">
                        <Logo aria-hidden="true" id="headerLogo" />
                        <span className="visually-hidden">Integrity</span>
                    </Link>
                ) : (
                    <>
                        {" "}
                        <div className="mobile-med-icon">
                            <Logo aria-hidden="true" id="headerLogo" />
                            <span className="visually-hidden">Integrity</span>
                        </div>
                    </>
                )}
            </h1>
        </header>
    );
};

export default SimpleHeader;
