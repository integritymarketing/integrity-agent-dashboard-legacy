import React from "react";

import Box from "@mui/material/Box";

import Container from "components/ui/container";

import styles from "./HealthContainer.module.scss";
import HealthInfoContainer from "./HealthInfoContainer/HealthInfoContainer";
import HealthDetailsSection from "./HealthSection/HealthSection";

export const HealthContainer = () => {
    return (
        <Container className={styles.outerContainer}>
            <Box className={styles.healthContainer}>
                <Box className={styles.leftSection}>
                    <HealthInfoContainer />
                </Box>
                <Box className={styles.rightSection}>
                    <HealthDetailsSection />
                </Box>
            </Box>
        </Container>
    );
};
