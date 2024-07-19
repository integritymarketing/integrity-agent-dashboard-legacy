import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import styles from "./styles.module.scss";

const HeaderSection = ({ title }) => (
    <div className={styles.header}>
        <Typography variant="h2" className={styles.headerText}>
            {title}
        </Typography>
    </div>
);

HeaderSection.propTypes = {
    title: PropTypes.string.isRequired,
};

export default HeaderSection;
