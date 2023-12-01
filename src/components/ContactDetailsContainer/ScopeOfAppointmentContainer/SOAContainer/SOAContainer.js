import React from "react";
import Box from "@mui/material/Box";
import styles from "./SOAContainer.module.scss";

export const SOAContainer = ({ children }) => {
    return <Box className={styles.soaContainer}>{children}</Box>;
};
