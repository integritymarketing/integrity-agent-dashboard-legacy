import React from "react";
import Box from "@mui/material/Box";
import HealthDetailsSection from "./HealthSection/HealthSection";

import styles from "./HealthContainer.module.scss";
import HealthInfoContainer from "./HealthInfoContainer/HealthInfoContainer";

export const HealthContainer = () => {
    return (
        <>
            <Box className={styles.healthContainer}>
                <HealthInfoContainer />
                <HealthDetailsSection />
            </Box>
        </>
    );
};