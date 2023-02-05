import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import styles from "./HeaderUnAuthenticated.module.scss";
import LogoSVG from "./Logo.svg";

export const HeaderUnAuthenticated = () => {
  return (
    <Grid
      className={styles.headerContainer}
      alignItems="center"
      justifyContent={{ xs: "center", sm: "left" }}
      container
    >
      <img alt="Medicare Logo" src={LogoSVG} className={styles.logo} />
    </Grid>
  );
};
