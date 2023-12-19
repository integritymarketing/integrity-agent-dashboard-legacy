import React from "react";

import Grid from "@mui/material/Unstable_Grid2/Grid2";

import useClientId from "hooks/auth/useClientId";

import styles from "./HeaderUnAuthenticated.module.scss";
import LogoSVG from "./Logo.svg";
import MobileLogo from "./MobileLogo.svg";

import ILSLogo from "../../images/auth/lead-center-rgb.png";

export const HeaderUnAuthenticated = () => {
    const clientId = useClientId();
    if (clientId === "AgentMobile") return null;
    return (
        <Grid
            className={styles.headerContainer}
            alignItems="center"
            justifyContent={{ xs: "center", sm: "left" }}
            container
        >
            {clientId === "AgentMobile" ? (
                <img alt="Integrity Logo" src={MobileLogo} className={styles.logo} />
            ) : (
                <>
                    {clientId === "ILSClient" ? (
                        <img className={styles.logo} src={ILSLogo} alt="Integrity Lead Store" />
                    ) : (
                        <img alt="Medicare Logo" src={LogoSVG} className={styles.logo} />
                    )}
                </>
            )}
        </Grid>
    );
};
