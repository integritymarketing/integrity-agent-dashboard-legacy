import React from "react";
import { Helmet } from "react-helmet-async";
import Styles from "./AuthPages.module.scss";
import "./mobileStyle.scss";
import Heading2 from "packages/Heading2";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { Box } from "@mui/material";

export default () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Mobiile App Update</title>
      </Helmet>
      <div className="content-frame v2">
        <HeaderUnAuthenticated />
        <ContainerUnAuthenticated>
          <Heading2
            className={Styles.versionText}
            text="A New Version of MedicareCENTER is Available"
          />
          <Box mt={"1rem"} className={Styles.downloadText}>
            Please download the latest version of the app in order to continue.
          </Box>
          <div className={Styles.buttonContainer}>
            <button className={Styles.submitButton}>Update</button>
          </div>
        </ContainerUnAuthenticated>
        <FooterUnAuthenticated />
      </div>
    </React.Fragment>
  );
};
