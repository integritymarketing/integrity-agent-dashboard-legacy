import Box from "@mui/material/Box";

import HealthInactive from "components/icons/version-2/HealthInactive";
import HeartInactive from "components/icons/version-2/HeartInactive";

import styles from "./styles.module.scss";

function CardLifeAndHealth() {
    return (
        <Box className={styles.innerWrapper}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box className={styles.tag}>Life</Box>
                <HeartInactive />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box className={styles.tag}>Health</Box>
                <HealthInactive />
            </Box>
        </Box>
    );
}

export default CardLifeAndHealth;
