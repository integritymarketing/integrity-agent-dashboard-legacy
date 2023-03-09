import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import styles from "./HeaderUnAuthenticated.module.scss";
import LogoSVG from "./Logo.svg";
import useClientId from "hooks/auth/useClientId";
import ILSLogo from "../../images/auth/lead-center-rgb.png";

export const HeaderUnAuthenticated = () => {
  const clientId = useClientId();
  return (
    <Grid
      className={styles.headerContainer}
      alignItems="center"
      justifyContent={{ xs: "center", sm: "left" }}
      container
    >
      {clientId === "ILSClient" ? (
        <img className={styles.logo} src={ILSLogo} alt="Integrity Lead Store" />
      ) : (
        <img alt="Medicare Logo" src={LogoSVG} className={styles.logo} />
      )}
    </Grid>
  );
};
