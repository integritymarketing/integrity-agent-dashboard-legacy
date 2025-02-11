import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

import styles from "./styles.module.scss";

const Option = ({ optionText, icon: Icon = null, onClick = () => {}, ...props }) => (
    <Box className={styles.optionItem} {...props} onClick={onClick}>
        {Icon && <Icon />}
        <Typography
            sx={{
                fontSize: "16px",
                color: "#434a51",
                marginLeft: "10px",
                fontWeight: "400",
            }}
            className={styles.optionLinkText}
        >
            {optionText}
        </Typography>
    </Box>
);

Option.propTypes = {
    optionText: PropTypes.string.isRequired, // Text for the option
    icon: PropTypes.elementType.isRequired, // Icon component for the option
};

export default Option;
