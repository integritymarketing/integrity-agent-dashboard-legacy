// External Packages
import React from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

// Internal Modules
import InfoBlueIcon from "components/icons/info-blue";

import styles from "./FinalExpensePlanCostDetails.module.scss";

const FinalExpensePlanCostDetails = ({
    rates,
    policyFee,
    isSocialSecurityBillingSupported,
    planInfo,
    underwritingWarning,
}) => {
    const monthlyPremium = rates?.[0]?.monthlyPremium || 0;
    const coverageAmount = monthlyPremium * (12 - new Date().getMonth()); // TODO

    return (
        <Box className={styles.costCard}>
            <Box className={styles.monthlyCostCard}>
                <div className={styles.monthlyCostLabel}>Coverage Amount</div>
                <div className={styles.monthlyCostValue}>${coverageAmount}</div>
                <div className={styles.monthlyCostLabel}>Monthly Premium</div>
                <div className={styles.monthlyCostValue}>
                    ${monthlyPremium}
                    <span>/mo</span>
                </div>
            </Box>

            <Box className={styles.costDetails}>
                <Box className={styles.costRow}>
                    <div className={styles.costLabel}>Policy Fee</div>
                    <div className={styles.costValue}>${policyFee}</div>
                </Box>
                <Box className={styles.costRow}>
                    <div className={styles.costLabel}>Social Security Billing Supported</div>
                    <div className={styles.costValue}>{isSocialSecurityBillingSupported ? "Yes" : "No"}</div>
                </Box>
                <Box className={styles.costRow}>
                    <div className={styles.costLabel}>Plan Info</div>
                    <div className={styles.costValue}>
                        {planInfo?.map((item, index) => (
                            <div key={index} className={styles.planInfoDetail}>
                                {item}
                            </div>
                        ))}
                    </div>
                </Box>
                <Box className={styles.warningContainer}>
                    <div className={styles.warning}>Warnings</div>
                    <div title={underwritingWarning} className={styles.warningIcon}>
                        <InfoBlueIcon color="#4178FF" />
                    </div>
                </Box>
            </Box>
        </Box>
    );
};

FinalExpensePlanCostDetails.propTypes = {
    rates: PropTypes.arrayOf(
        PropTypes.shape({
            monthlyPremium: PropTypes.number, // The monthly premium rate
        })
    ),
    policyFee: PropTypes.number, // The fee associated with the policy
    isSocialSecurityBillingSupported: PropTypes.bool, // Indicates if social security billing is supported
    planInfo: PropTypes.arrayOf(PropTypes.string), // Array containing plan information details
    underwritingWarning: PropTypes.string, // Warning or notice related to underwriting
};

export default FinalExpensePlanCostDetails;
