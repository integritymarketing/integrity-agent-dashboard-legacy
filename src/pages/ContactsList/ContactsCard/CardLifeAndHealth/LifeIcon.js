import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import Heartactive from "components/icons/version-2/HeartActive";
import HeartInactive from "components/icons/version-2/HeartInactive";
import styles from "./styles.module.scss";

function LifeIcon({ lifePolicyCount }) {
    if (lifePolicyCount === 0 || !lifePolicyCount) {
        return <HeartInactive />;
    }

    return (
        <Box position="relative" display="inline-block">
            <Heartactive />
            {/* {lifePolicyCount > 1 && <Box className={styles.count}>{lifePolicyCount}</Box>} */}
        </Box>
    );
}

LifeIcon.propTypes = {
    lifePolicyCount: PropTypes.number,
};

export default LifeIcon;
