import React, { useState } from "react";

import PropTypes from "prop-types";

import { toTitleCase } from "utils/toTitleCase";

import {
    APPLY,
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
    ENROLLEMENT_SERVICE,
    MONTHLY_PREMIUM,
    PLAN_INFO,
    POLICY_FEE,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import InfoBlue from "components/icons/version-2/InfoBlue";
import { Button } from "components/ui/Button";

import styles from "./PlanDetailsContainer.module.scss";
import { PrescreenModal } from "./PrescreenModal";
import useFetch from "hooks/useFetch";
import { useRecoilValue } from "recoil";
import { agentInformationSelector } from "recoil/agent/selectors";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import { getPlanEnrollBody } from "./PlanDetailsContainer.utils";
import { FinalExpenseEnrollResponseModal } from "./FinalExpenseEnrollResponseModal";

export const PlanCard = ({
    isMobile,
    planName,
    logoUrl,
    resource_url,
    naic,
    coverageType,
    coverageAmount,
    monthlyPremium,
    policyFee,
    eligibility,
    conditionList,
    benefits = [],
    isRTS,
    isHaveCarriers,
    writingAgentNumber,
    contactId
}) => {
    const [isPrescreenModalOpen, setIsPrescreenModalOpen] = useState(false);
    const { leadDetails } = useContactDetails(contactId);
    const { agentFirstName, agentLastName } = useRecoilValue(agentInformationSelector);
    const { Post: enrollLeadFinalExpensePlan } = useFetch(`${ENROLLEMENT_SERVICE}${contactId}/naic/${naic}`);
    const [enrollResponse, setEnrollResponse] = useState(null);

    const onApply = async () => {
        const body = getPlanEnrollBody(writingAgentNumber, agentFirstName, agentLastName, leadDetails, coverageAmount, planName, resource_url);
        console.log({ body });
        const response = await enrollLeadFinalExpensePlan(body);
        console.log({ response });

        if (response.RedirectUrl) {
            window.open(response.RedirectUrl, "_blank");
        } else {
            setEnrollResponse(response);
        }
    }


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
                conditionList={conditionList}
            />
            <FinalExpenseEnrollResponseModal
                isOpen={enrollResponse !== null}
                onClose={() => setEnrollResponse(null)}
                enrollResponse={enrollResponse}
            />
            <div className={styles.applyCTA}>
                <Button
                    label={APPLY}
                    disabled={!isRTS || !isHaveCarriers}
                    onClick={onApply}
                    type="primary"
                    icon={<ButtonCircleArrow />}
                    iconPosition="right"
                    className={`${styles.applyButton} ${!isRTS || !isHaveCarriers ? styles.disabled : ""}`}
                />
            </div>
        </div>
    );
};

PlanCard.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    planName: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    resource_url: PropTypes.string.isRequired,
    naic: PropTypes.string.isRequired,
    contactId: PropTypes.string.isRequired,
    writingAgentNumber: PropTypes.string.isRequired,
    coverageType: PropTypes.string.isRequired,
    coverageAmount: PropTypes.number.isRequired,
    monthlyPremium: PropTypes.number.isRequired,
    policyFee: PropTypes.number.isRequired,
    eligibility: PropTypes.string.isRequired,
    benefits: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};