import React from "react";
import styles from "./styles.module.scss";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Typography } from "@mui/material";
import Integrity from "./Integrity.svg";
import usePortalUrl from "hooks/usePortalUrl";

export const MobileFooter = () => {
  const portalUrl = usePortalUrl();

  return (
    <Grid
      alignItems={"center"}
      justifyContent={{ xs: "center", sm: "space-between" }}
      className={styles.footerContainer}
      container
      px={{ xs: "0rem", sm: "2rem", md: "8.5rem" }}
    >
      <Grid container>
        <a
          href={`${portalUrl || ""}/terms`}
          rel="noopener noreferrer"
          className={styles.textContent}
        >
          Terms of Use
        </a>
        <Typography className={styles.textContent} px={"1rem"}>
          |
        </Typography>
        <a
          href={`${portalUrl || ""}/privacy`}
          rel="noopener noreferrer"
          className={styles.textContent}
        >
          Privacy Policy
        </a>
      </Grid>

      <Grid>
        <Grid
          align={{ xs: "center", sm: "right" }}
          container
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <img alt="Integrity Logo" src={Integrity} />
          <Typography
            ml={{ sm: "1rem" }}
            mt={{ xs: "0.5rem", sm: 0 }}
            className={styles.textContent}
          >
            &copy; {new Date().getFullYear()} Integrity. All rights reserved.{" "}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
