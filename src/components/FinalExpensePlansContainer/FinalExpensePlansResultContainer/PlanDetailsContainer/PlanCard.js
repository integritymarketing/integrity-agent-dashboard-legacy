import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { agentInformationSelector } from "recoil/agent/selectors";

import { convertToTitleCase } from "utils/toTitleCase";

import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";

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

import useContactDetails from "pages/ContactDetails/useContactDetails";

import { FinalExpenseEnrollResponseModal } from "./FinalExpenseEnrollResponseModal";
import styles from "./PlanDetailsContainer.module.scss";
import { getPlanEnrollBody } from "./PlanDetailsContainer.utils";
import { PrescreenModal } from "./PrescreenModal";

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
    isRTSPlan,
    isHaveCarriers,
    writingAgentNumber,
    contactId,
    selectedTab,
}) => {
    const [isPrescreenModalOpen, setIsPrescreenModalOpen] = useState(false);
    const { leadDetails } = useContactDetails(contactId);
    const { fireEvent } = useAnalytics();
    const { agentFirstName, agentLastName } = useRecoilValue(agentInformationSelector);
    const { Post: enrollLeadFinalExpensePlan } = useFetch(`${ENROLLEMENT_SERVICE}${contactId}/naic/${naic}`);
    const [enrollResponse, setEnrollResponse] = useState(null);

    const onApply = async () => {
        fireEvent("Life Apply CTA Clicked", {
            leadid: contactId,
            line_of_business: "Life",
            product_type: "final_expense",
            enabled_filters: [],
            coverage_vs_premium: selectedTab,
            coverage_amount: coverageAmount,
            premium_amount: monthlyPremium,
            coverage_type_selected: coverageType,
            pre_screening_status: eligibility, // TODO-EVENT: pre_screening_status
            carrier_group: null, // TODO-EVENT: carrier_group
            carrier: null, // TODO-EVENT: carrier
        });

        const body = getPlanEnrollBody(
            writingAgentNumber,
            agentFirstName,
            agentLastName,
            leadDetails,
            coverageAmount,
            planName,
            resource_url,
            contactId
        );
        const response = await enrollLeadFinalExpensePlan(body);

        if (response.RedirectUrl) {
            window.open(response.RedirectUrl, "_blank");
        } else {
            setEnrollResponse(response);
        }
    };

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

    useEffect(() => {
        if (isPrescreenModalOpen) {
            fireEvent("Final Expense Prescreening Notes Viewed", {
                leadid: contactId,
                line_of_business: "Life",
                product_type: "final_expense",
                enabled_filters: [],
                coverage_vs_premium: selectedTab,
                coverage_amount: coverageAmount,
                premium_amount: monthlyPremium,
                coverage_type_selected: coverageType,
                pre_screening_status: eligibility, // TODO-EVENT: pre_screening_status
                carrier_group: null, // TODO-EVENT: carrier_group
                carrier: null, // TODO-EVENT: carrier
            });
        }
    }, [isPrescreenModalOpen, contactId]);

    return (
        <div className={styles.planBox}>
            <div className={styles.header}>
                <div>{planName}</div>
                {logoUrl && <img src={logoUrl} alt="plan logo" className={styles.logo} />}
            </div>
            <div>
                <span className={styles.label}>{COVERAGE_TYPE}</span>
                <span>{convertToTitleCase(coverageType)}</span>
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
                    disabled={!isRTSPlan || !isHaveCarriers}
                    onClick={onApply}
                    type="primary"
                    icon={<ButtonCircleArrow />}
                    iconPosition="right"
                    className={`${styles.applyButton} ${!isRTSPlan || !isHaveCarriers ? styles.disabled : ""}`}
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
