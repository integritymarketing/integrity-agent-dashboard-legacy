import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const IconBackGround = ({ children, width = "40px", height = "40px", backgroundColor = "#ffffff" }) => {
    return (
        <Box
            className={styles.iconBackGround}
            sx={{
                width: width,
                height: height,
                backgroundColor: backgroundColor,
            }}
        >
            {children}
        </Box>
    );
};

IconBackGround.propTypes = {
    children: PropTypes.node.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    backgroundColor: PropTypes.string,
};

export default IconBackGround;
