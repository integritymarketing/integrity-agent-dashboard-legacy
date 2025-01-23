import React from "react";

import Grid from "@mui/material/Unstable_Grid2/Grid2";

import useClientId from "hooks/auth/useClientId";

import styles from "./MobileHeaderUnAuthenticated.module.scss";
import MobileLogo from "./mobileLogo.svg";

export const MobileHeaderUnAuthenticated = () => {
    const clientId = useClientId();
    if (clientId !== "AgentMobile") return null;
    return (
        <Grid
            className={styles.headerContainer}
            alignItems="center"
            justifyContent={{ xs: "center", sm: "left" }}
            container
        >
            <img className={styles.mobileLogo} src={MobileLogo} alt="Agent Mobile" />
        </Grid>
    );
};
