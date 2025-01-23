import React from "react";

import PropTypes from "prop-types";

import usePortalUrl from "hooks/usePortalUrl";

import "./index.scss";

import MCLogo from "images/mc-logo.svg";

const SimpleFooter = ({ className = "", mobileAppLogin }) => {
    const portalUrl = usePortalUrl();

    return (
        <footer className={`simple-footer ${className}`}>
            <div className="simple-footer__content sf-text-center">
                <nav className="simple-footer__links">
                    <ul className="divided-hlist">
                        {!mobileAppLogin && (
                            <>
                                <li>
                                    <a
                                        href={`${portalUrl || ""}/terms`}
                                        rel="noopener noreferrer"
                                        className="link link--inherit"
                                    >
                                        Terms of Use
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`${portalUrl || ""}/privacy`}
                                        rel="noopener noreferrer"
                                        className="link link--inherit"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
                <small className="simple-footer__legal">
                    <span className="integrity-logo">
                        <img src={MCLogo} alt="Integrity Logo" className="mc-img" />
                    </span>
                    <br />
                    <span>&copy; {new Date().getFullYear()}</span> <span>Integrity.</span>{" "}
                    <span>All rights reserved.</span>
                </small>
            </div>
        </footer>
    );
};

SimpleFooter.propTypes = {
    className: PropTypes.string,
    mobileAppLogin: PropTypes.bool,
};

SimpleFooter.defaultProps = {
    className: "",
    mobileAppLogin: false,
};

export default SimpleFooter;
