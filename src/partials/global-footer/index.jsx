import React, { useState } from "react";
import Media from "react-media";
import { Link } from "react-router-dom";

import { MobileFooter } from "mobile/MobileFooter";
import PropTypes from "prop-types";

import usePortalUrl from "hooks/usePortalUrl";

import analyticsService from "services/analyticsService";

import "./index.scss";

import integrityLogo from "../logo/integrity.svg";
import useUserProfile from "hooks/useUserProfile";

const GlobalFooter = ({ className = "", hideMedicareIcon = false, ...props }) => {
    const portalUrl = usePortalUrl();
    const [isMobile, setIsMobile] = useState(false);
    const { npn } = useUserProfile();

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            {isMobile ? (
                <MobileFooter />
            ) : (
                <footer className={`global-footer text-muted  ${className}`} data-gtm="footer-wrapper" {...props}>
                    <div className="global-footer__content sf-text-center">
                        {!hideMedicareIcon && (
                            <Link to="/">
                                <span className="visually-hidden">Integrity</span>
                                <img src={integrityLogo} alt="Integrity Logo" />
                            </Link>
                        )}
                        <nav className="global-footer__links mt-4">
                            <h2 className="visually-hidden">Additional Navigation</h2>
                            <ul className="divided-hlist">
                                <Media
                                    queries={{
                                        small: "(max-width: 767px)",
                                    }}
                                >
                                    {(matches) =>
                                        !matches.small ? (
                                            <>
                                                <li>
                                                    <Link
                                                        to="/help"
                                                        className={`link link--inherit ${analyticsService.clickClass(
                                                            "help-footer"
                                                        )}`}
                                                    >
                                                        Need Help?
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/learning-center"
                                                        className={`link link--inherit ${analyticsService.clickClass(
                                                            "learningcenter-footer"
                                                        )}`}
                                                    >
                                                        Learning Center
                                                    </Link>
                                                </li>
                                            </>
                                        ) : null
                                    }
                                </Media>
                                <li>
                                    <a
                                        href={`${import.meta.env.VITE_CONNECTURE_LINK}/${npn}/${import.meta.env.VITE_CURRENT_PLAN_YEAR}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className="link link--inherit"
                                    >
                                        MedicareAPP
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={import.meta.env.VITE_SUNFIRE_SSO_URL}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className="link link--inherit"
                                    >
                                        MedicareLINK
                                    </a>
                                </li>
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
                            </ul>
                        </nav>
                        <small className="global-footer__legal mt-4">
                            <span>&copy; {new Date().getFullYear()}</span> <span>Integrity.</span>{" "}
                            <span>All rights reserved.</span>
                        </small>
                    </div>
                </footer>
            )}
        </>
    );
};

GlobalFooter.propTypes = {
    className: PropTypes.string,
    hideMedicareIcon: PropTypes.bool,
};

export default GlobalFooter;
