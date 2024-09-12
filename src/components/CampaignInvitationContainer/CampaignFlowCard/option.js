import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

import styles from "./styles.module.scss";

const Option = ({ optionText, icon: Icon = null, onClick, ...props }) => (
    <Box className={styles.optionItem} {...props} onClick={onClick}>
        {Icon && <Icon />}
        <Typography className={styles.optionLinkText}>
            {optionText}
        </Typography>
    </Box>
);

Option.propTypes = {
    optionText: PropTypes.string.isRequired, // The text displayed for the option
    icon: PropTypes.element, // Icon component or null
    onClick: PropTypes.func, // Callback function when the option is clicked
};

Option.defaultProps = {
    icon: null, // Default icon is null, meaning no icon is displayed
    onClick: () => {}, // Default onClick does nothing if not provided
};

export default Option;
