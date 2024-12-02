import React from "react";
import { Box, Typography } from "@mui/material";
import styles from "./styles.module.scss";

export const IulQuoteHeader = ({ title }) => {
    return (
        <Box className={styles.headerContainer}>
            <Typography variant="h2" color="#052A63">
                {title}
            </Typography>
        </Box>
    );
};
