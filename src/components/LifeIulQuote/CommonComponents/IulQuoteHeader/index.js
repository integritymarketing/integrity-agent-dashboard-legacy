import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
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

IulQuoteHeader.propTypes = {
    title: PropTypes.string.isRequired,
};
