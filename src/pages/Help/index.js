import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CallIcon from "components/icons/callicon";
import PropTypes from "prop-types";
import Footer from "components/Footer";
import GlobalNav from "partials/global-nav-v2";
import Heading2 from "packages/Heading2";
import Heading3 from "packages/Heading3";
import Heading4 from "packages/Heading4";
import MailIcon from "components/icons/mailicon";
import Media from "react-media";
import Paragraph from "packages/Paragraph";
import styles from "./styles.module.scss";
import { Helmet } from "react-helmet-async";
import { Box } from "@mui/material";
import MissingActiveSellingPermissions from "components/MissingActiveSellingPermissions";
import BackButton from "components/icons/back-button-2";

const HelpPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleMediaQueryChange = useCallback((isMobile) => {
    setIsMobile(isMobile);
  }, []);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Media
        query={"(max-width: 500px)"}
        onChange={handleMediaQueryChange}
        defaultMatches={isMobile}
      />
      <Helmet>
        <title>Integrity Clients - Help</title>
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
              {isMobile ? (
                <Heading2 text={"Contact Support"} />
              ) : (
                <Heading3 text={"Contact Support"} />
              )}
            </Box>
            <Box sx={{ py: "5px" }}>
              <Heading4
                text={
                  "Call or email one of our support representatives to help resolve your issue."
                }
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
            <Box className={styles.sectionRoundedBottom}>
              <div className={styles.iconBg}>
                <MailIcon />
              </div>
              <a
                className={styles.cta}
                href="mailto: support@medicarecenter.com"
              >
                <Paragraph
                  className={styles.helpText}
                  text={"support@medicarecenter.com"}
                />
              </a>
            </Box>
          </div>
          <MissingActiveSellingPermissions />
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

HelpPage.propTypes = {
  someProp: PropTypes.string,
};

export default HelpPage;
