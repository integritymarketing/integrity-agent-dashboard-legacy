import React from "react";
import { Link } from "react-router-dom";
import styles from "./FooterUnAuthenticated.module.scss";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Typography } from "@mui/material";
import Integrity from "./Integrity.svg";

export const FooterUnAuthenticated = (props) => {
  return (
    <Grid
      alignItems={"center"}
      justifyContent={{ xs: "center", sm: "space-between" }}
      className={styles.footerContainer}
      container
      px={{ xs: "0rem", sm: "2rem", md: "8.5rem" }}
    >
      <Grid container>
        <Link to={`/terms`} className={styles.textContent}>
          Terms of Use
        </Link>
        <Typography className={styles.textContent} px={"1rem"}>
          |
        </Typography>
        <Link to={`/privacy`} className={styles.textContent}>
          Privacy Policy
        </Link>
      </Grid>
      <Grid>
        <Grid align="right" container>
          <img alt="Integrity Logo" src={Integrity} />
          <Typography ml="1rem" className={styles.textContent}>
            &copy; {new Date().getFullYear()} Integrity. All rights reserved.{" "}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
