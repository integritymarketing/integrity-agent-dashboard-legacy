import CallIcon from "components/icons/callicon";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import Heading2 from "packages/Heading2";
import Heading3 from "packages/Heading3";
import Heading4 from "packages/Heading4";
import MailIcon from "components/icons/mailicon";
import Media from "react-media";
import Paragraph from "packages/Paragraph";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Helmet } from "react-helmet-async";
import { Box } from "@mui/material";

const HelpPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <React.Fragment>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Helmet>
        <title>MedicareCENTER - Help</title>
      </Helmet>
      <GlobalNav />
      <div className={styles.layout}>
        {!isMobile && (
          <div className={styles.headerLayoutContainer}>
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
                <Paragraph text={"888-818-3760"} />
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
                <Paragraph text={"support@medicarecenter.com"} />
              </a>
            </Box>
          </div>
        </div>
      </div>
      <GlobalFooter className={styles.footer} />
    </React.Fragment>
  );
};

export default HelpPage;
