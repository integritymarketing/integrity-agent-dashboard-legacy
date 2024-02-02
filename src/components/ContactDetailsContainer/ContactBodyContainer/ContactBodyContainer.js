import React from "react";
import Box from "@mui/material/Box";
import styles from "./ContactBodyContainer.module.scss";

export const ContactBodyContainer = ({ children }) => {
    return <Box className={styles.ContactDetailsContainer}>{children}</Box>;
};
