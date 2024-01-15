import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import HealthActive from "components/icons/version-2/HealthActive";
import HealthInactive from "components/icons/version-2/HealthInactive";

import styles from "./styles.module.scss";

function HealthIcon({ healthPolicyCount }) {
    if (healthPolicyCount === 0 || !healthPolicyCount) {
        return (
            <Box marginTop="-3px">
                <HealthInactive />
            </Box>
        );
    }

    return (
        <Box position="relative" display="inline-block">
            <HealthActive />
            {/* {healthPolicyCount > 1 && <Box className={styles.count}>{healthPolicyCount}</Box>} */}
        </Box>
    );
}

HealthIcon.propTypes = {
    healthPolicyCount: PropTypes.number,
};

export default HealthIcon;
