import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Box className={styles.header}>
                <Typography className={styles.label}>{title}</Typography>

                <Box className={`${styles.icon} ${!isOpen ? styles.iconRotate : ""}`} onClick={toggleSection}>
                    <ArrowDownBig />
                </Box>
            </Box>
            {isOpen && children}
        </>
    );
};

export default CollapsibleSection;
