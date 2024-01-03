import React, { useState } from "react";

import PropTypes from "prop-types";

import { toTitleCase } from "utils/toTitleCase";

import {
    APPLY,
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
    MONTHLY_PREMIUM,
    PLAN_INFO,
    POLICY_FEE,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import InfoBlue from "components/icons/version-2/InfoBlue";
import { Button } from "components/ui/Button";

import styles from "./PlanDetailsContainer.module.scss";
import { PrescreenModal } from "./PrescreenModal";

export const PlanCard = ({
    isMobile,
    planName,
    logoUrl,
    coverageType,
    coverageAmount,
    monthlyPremium,
    policyFee,
    eligibility,
    benefits = [],
    isNonRTS_User,
    isHavecarriers,
}) => {
    const [isPrescreenModalOpen, setIsPrescreenModalOpen] = useState(false);
    const renderBenefits = () => (
        <table>
            <thead>
                <tr>
                    <th className={styles.spacing}>{benefits[0][0]}</th>
                    <th>{benefits[0][1]}</th>
                </tr>
            </thead>
            <tbody>
                {benefits.slice(1).map((benefit, index) => (
                    <tr key={index}>
                        <td className={styles.spacing}>{benefit[0]}</td>
                        <td>{benefit[1]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className={styles.planBox}>
            <div className={styles.header}>
                <div>{planName}</div>
                {logoUrl && <img src={logoUrl} alt="plan logo" className={styles.logo} />}
            </div>
            <div>
                <span className={styles.label}>{COVERAGE_TYPE}</span>
                <span>{toTitleCase(coverageType)}</span>
            </div>
            <div className={`${styles.additionalInfo} ${isMobile ? styles.column : ""}`}>
                <div className={styles.amountInfo}>
                    <div className={styles.coverageAmount}>
                        <div>{COVERAGE_AMOUNT}</div>
                        <div className={styles.amount}>${coverageAmount.toLocaleString()}</div>
                    </div>
                    <div>
                        <div>{MONTHLY_PREMIUM}</div>
                        <div className={styles.amount}>
                            ${monthlyPremium}
                            <span className={styles.unit}>/mo</span>
                        </div>
                    </div>
                </div>
                <div className={`${styles.feePlanInfo} ${isMobile ? styles.MfeePlanInfo : ""}`}>
                    <div>
                        <span className={styles.label}>{POLICY_FEE}</span>
                        <span>${policyFee}</span>
                    </div>
                    {benefits.length > 0 && renderBenefits() && (
                        <div className={styles.flex}>
                            <span className={styles.label}>{PLAN_INFO}&nbsp;&nbsp;</span>
                        </div>
                    )}
                </div>
            </div>
            {eligibility && (
                <div className={styles.prescreen}>
                    <span onClick={() => setIsPrescreenModalOpen(true)}>
                        <InfoBlue />
                    </span>
                    {eligibility}
                </div>
            )}

            <PrescreenModal
                isOpen={isPrescreenModalOpen}
                onClose={() => setIsPrescreenModalOpen(false)}
                eligibility={eligibility}
            />

            <div className={styles.applyCTA}>
                <Button
                    label={APPLY}
                    disabled={isNonRTS_User || !isHavecarriers}
                    type="primary"
                    icon={<ButtonCircleArrow />}
                    iconPosition="right"
                    className={`${styles.applyButton} ${isNonRTS_User || !isHavecarriers ? styles.disabled : ""}`}
                />
            </div>
        </div>
    );
};

PlanCard.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    planName: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    coverageType: PropTypes.string.isRequired,
    coverageAmount: PropTypes.number.isRequired,
    monthlyPremium: PropTypes.number.isRequired,
    policyFee: PropTypes.number.isRequired,
    eligibility: PropTypes.string.isRequired,
    benefits: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
