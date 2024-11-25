import React, { useCallback, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useNavigate, useLocation } from "react-router-dom";

import { Box } from "@mui/material";

import PropTypes from "prop-types";

import Heading2 from "packages/Heading2";
import Heading3 from "packages/Heading3";
import Heading4 from "packages/Heading4";
import Paragraph from "packages/Paragraph";

import BackButton from "components/icons/back-button-2";
import CallIcon from "components/icons/callicon";
import MailIcon from "components/icons/mailicon";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import styles from "./styles.module.scss";
import LiveChat from "components/icons/version-2/LiveChat";
import useUserProfile from "hooks/useUserProfile";
import useCustomLiveChat from "hooks/useCustomLiveChat";
import { useOnClickOutside } from "hooks/useOnClickOutside";

const HelpPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { firstName, lastName, email, phone } = useUserProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const fcFrameRef = useRef(null);

    const { handleOpenLiveChat, handleCloseLiveChat } = useCustomLiveChat(firstName, lastName, email, phone, location);

    const handleMediaQueryChange = useCallback((matches) => {
        setIsMobile(matches);
    }, []);

    useOnClickOutside(fcFrameRef, handleCloseLiveChat);

    return (
        <React.Fragment>
            <Media query={"(max-width: 500px)"} onChange={handleMediaQueryChange} defaultMatches={isMobile} />
            <Helmet>
                <title>Integrity - Help</title>
            </Helmet>
            <GlobalNav />
            <div className={styles.layout}>
                {!isMobile && (
                    <div className={styles.headerLayoutContainer}>
                        <div onClick={() => navigate(-1)} className={styles.backButton}>
                            <BackButton />
                            <div className={styles.backButtonText}>Back</div>
                        </div>
                        <div className={styles.headerLayout}>
                            <Heading2 className={styles.headerLayoutText} text="Need Help?" />
                        </div>
                    </div>
                )}
                <div className={styles.outerContainer}>
                    <div className={styles.centerContainer}>
                        <Box sx={{ py: "5px" }}>
                            {isMobile ? <Heading2 text={"Contact Support"} /> : <Heading3 text={"Contact Support"} />}
                        </Box>
                        <Box sx={{ py: "5px" }}>
                            <Heading4
                                text={"Call or email one of our support representatives to help resolve your issue."}
                                className={styles.subHeadingOverride}
                            />
                        </Box>
                        <Box className={styles.sectionRoundedTop}>
                            <div className={styles.iconBg}>
                                <CallIcon />
                            </div>
                            <a className={styles.cta} href="tel:8888183760">
                                <Paragraph className={styles.helpText} text={"888-818-3760"} />
                            </a>
                        </Box>
                        <Box className={`${styles.sectionRoundedBottom} ${styles.sectionMiddle}`}>
                            <div className={styles.iconBg}>
                                <MailIcon />
                            </div>
                            <a className={styles.cta} href="mailto: support@clients.integrity.com">
                                <Paragraph className={styles.helpText} text={"support@clients.integrity.com"} />
                            </a>
                        </Box>
                        <Box className={styles.sectionRoundedBottom} sx={{ cursor: "pointer" }}>
                            <div className={styles.iconBg}>
                                <LiveChat />
                            </div>
                            <div className={styles.cta} onClick={handleOpenLiveChat}>
                                <Paragraph className={styles.helpText} text={"Live chat"} />
                            </div>
                        </Box>
                    </div>
                </div>
            </div>

            <GlobalFooter />
        </React.Fragment>
    );
};

HelpPage.propTypes = {
    someProp: PropTypes.string,
};

export default HelpPage;
