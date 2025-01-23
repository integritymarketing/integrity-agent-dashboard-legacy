import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import HealthIcon from "./HealthIcon";
import LifeIcon from "./LifeIcon";
import styles from "./styles.module.scss";

function CardLifeAndHealth({ item }) {
    const { lifePolicyCount, healthPolicyCount } = item;

    return (
        <Box className={styles.innerWrapper}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box className={styles.tag}>Life</Box>
                <LifeIcon lifePolicyCount={lifePolicyCount} />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box className={styles.tag}>Health</Box>
                <HealthIcon healthPolicyCount={healthPolicyCount} />
            </Box>
        </Box>
    );
}

CardLifeAndHealth.propTypes = {
    item: PropTypes.object,
};

export default CardLifeAndHealth;
