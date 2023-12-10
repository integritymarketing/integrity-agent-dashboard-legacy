import React, { useCallback, useState } from "react";
import Media from "react-media";
import PropTypes from "prop-types";
import {
    APPLY,
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
    FACE_VALUE,
    MONTHLY_PREMIUM,
    PLAN_INFO,
    POLICY_FEE,
    PRESCREEN_AVAILABLE,
    YEARS,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { Button } from "components/ui/Button";
import styles from "./PlanDetailsContainer.module.scss";
import PersonalisedQuoteBox from "../PersonalisedQuoteBox/PersonalisedQuoteBox";
export const PlanDetailsContainer = ({
    coverageType,
    coverageAmount,
    monthlyPremium,
    policyFee,
    faceValueRates,
    logoUrl,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const PlanBox = ({ planName }) => (
        <div className={styles.planBox}>
            <div className={styles.header}>
                <div>{planName}</div>
                <img src={logoUrl} alt="plan-logo" className={styles.logo} />
            </div>
            <div>
                <span className={styles.label}>{COVERAGE_TYPE}</span>
                <span>{coverageType}</span>
            </div>
            <div className={`${styles.additionalInfo} ${isMobile ? styles.column : ""}`}>
                <div className={styles.amountInfo}>
                    <div className={styles.coverageAmount}>
                        <div>{COVERAGE_AMOUNT}</div>
                        <div className={styles.amount}>${coverageAmount}</div>
                    </div>
                    <div>
                        <div>{MONTHLY_PREMIUM}</div>
                        <div className={styles.amount}>${monthlyPremium}</div>
                    </div>
                </div>
                <div className={`${styles.feePlanInfo} ${isMobile ? styles.MfeePlanInfo : ""}`}>
                    <div>
                        <span className={styles.label}>{POLICY_FEE}</span>
                        <span>${policyFee}</span>
                    </div>
                    <div className={styles.flex}>
                        <span className={styles.label}>{PLAN_INFO}&nbsp;&nbsp;</span>
                        <table>
                            <thead>
                                <tr>
                                    <th className={styles.spacing}>{YEARS}</th>
                                    <th>{FACE_VALUE}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faceValueRates?.map((rate, index) => (
                                    <tr key={index}>
                                        <td className={styles.spacing}>{rate.years}</td>
                                        <td>{rate.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

    return (
        <>
            <Media
                query={"(max-width: 1130px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.planContainer}>
                <PersonalisedQuoteBox />
                {["Final Expense Plan", "Aflac Final Expense Immediate Benefit", "Final Expense Plan"].map((plan) => {
                    return <PlanBox planName={plan} />;
                })}
            </div>
        </>
    );
};

// Define PropTypes for type checking and document why each prop is used
PlanDetailsContainer.propTypes = {
    coverageType: PropTypes.string.isRequired,
    coverageAmount: PropTypes.string.isRequired,
    monthlyPremium: PropTypes.string.isRequired,
    policyFee: PropTypes.string,
    faceValueRates: PropTypes.arrayOf(
        PropTypes.shape({
            years: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            percentage: PropTypes.number.isRequired,
        })
    ).isRequired,
    onApply: PropTypes.func, // Function to call when the apply button is clicked
};
