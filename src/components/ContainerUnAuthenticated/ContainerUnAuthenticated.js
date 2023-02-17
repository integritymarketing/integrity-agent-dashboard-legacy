import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import styles from "./ContainerUnAuthenticated.module.scss";

import bg from "./pixels.svg";

const backgroundImage = `url('${bg}')`;

export const ContainerUnAuthenticated = ({ children }) => {
  return (
    <Grid
      direction={"column"}
      className={styles.container}
      flexGrow={1}
      alignItems="center"
      justifyContent={{ xs: "flex-start", sm: "center" }}
      container
      my={{ xs: "3rem" }}
      style={{ backgroundImage }}
    >
      {children}
    </Grid>
  );
};
