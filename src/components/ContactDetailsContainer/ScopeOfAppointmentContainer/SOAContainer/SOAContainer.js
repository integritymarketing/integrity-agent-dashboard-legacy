import React from "react";
import Box from "@mui/material/Box";
import styles from "./SOAContainer.module.scss";

export const SOAContainer = ({ children, isSOATab }) => {
    return <Box className={`${styles.soaContainer} ${isSOATab ? styles.soaContainerFull : ""}`}>{children}</Box>;
};
