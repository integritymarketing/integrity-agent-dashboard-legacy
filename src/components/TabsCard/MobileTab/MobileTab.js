import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

const MobileTab = ({ index, tab, onTabClick, tabCount }) => {
    const { policyCount, policyStatusColor, policyStatus } = tab;

    const updatedPolicyStatus = policyStatus === "UnlinkedPolicies" ? "Unlinked" : policyStatus;
    const isSpecialFirstTab = tabCount === 3 && index === 0;

    return (
        <Box className={`${styles.tab} ${isSpecialFirstTab && styles.specialFirstTab}`}>
            <Box className={styles.tabHeading}>{updatedPolicyStatus}</Box>
            <Box onClick={() => onTabClick(index, policyCount)} className={styles.tabContent}>
                <Box style={{ backgroundColor: policyStatusColor }} className={styles.color}></Box>
                <Box className={styles.content}>{policyCount}</Box>
            </Box>
        </Box>
    );
};

MobileTab.propTypes = {
    index: PropTypes.number,
    tab: PropTypes.shape({
        policyCount: PropTypes.number,
        policyStatusColor: PropTypes.string,
        policyStatus: PropTypes.string,
    }).isRequired,
    onTabClick: PropTypes.func,
    tabCount: PropTypes.number,
};

export default MobileTab;
