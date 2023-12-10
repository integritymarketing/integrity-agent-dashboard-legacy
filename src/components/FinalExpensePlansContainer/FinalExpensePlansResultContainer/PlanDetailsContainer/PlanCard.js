import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui/Button';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import styles from "./PlanDetailsContainer.module.scss";
import {
    COVERAGE_TYPE,
    COVERAGE_AMOUNT,
    MONTHLY_PREMIUM,
    POLICY_FEE,
    PLAN_INFO,
    PRESCREEN_AVAILABLE,
    APPLY
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";



export const PlanCard = ({
    isMobile,
    planName,
    logoUrl,
    coverageType,
    coverageAmount,
    monthlyPremium,
    policyFee,
    benefits = []
}) => {
    console.log('benefits', benefits)
    // Using useMemo to optimize performance, especially if the benefits array is large
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
                <img src={logoUrl} alt="plan logo" className={styles.logo} />
            </div>
            <div>
                <span className={styles.label}>{COVERAGE_TYPE}</span>
                <span>{coverageType}</span>
            </div>
            <div className={`${styles.additionalInfo} ${isMobile ? styles.column : ""}`}>
                <div className={styles.amountInfo}>
                    <div className={styles.coverageAmount}>
                        <div>{COVERAGE_AMOUNT}</div>
                        <div className={styles.amount}>${coverageAmount.toLocaleString()}</div>
                    </div>
                    <div>
                        <div>{MONTHLY_PREMIUM}</div>
                        <div className={styles.amount}>${monthlyPremium}<span className={styles.unit}>/mo</span></div>
                    </div>
                </div>
                <div className={`${styles.feePlanInfo} ${isMobile ? styles.MfeePlanInfo : ""}`}>
                    <div>
                        <span className={styles.label}>{POLICY_FEE}</span>
                        <span>${policyFee}</span>
                    </div>
                    <div className={styles.flex}>
                        <span className={styles.label}>{PLAN_INFO}&nbsp;&nbsp;</span>
                        {benefits.length > 0 && renderBenefits()}
                    </div>
                </div>
            </div>
            <div className={styles.prescreen}>{PRESCREEN_AVAILABLE}</div>
            <div className={styles.applyCTA}>
                <Button
                    label={APPLY}
                    type="primary"
                    icon={<ButtonCircleArrow />}
                    iconPosition="right"
                    className={styles.applyButton}
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
    benefits: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};