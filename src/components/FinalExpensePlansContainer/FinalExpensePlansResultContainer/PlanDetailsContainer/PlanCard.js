/* eslint-disable max-lines-per-function */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { useLeadDetails } from "providers/ContactDetails";
import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";
import {
    APPLY,
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
    ENROLLEMENT_SERVICE,
    MONTHLY_PREMIUM,
    PLAN_INFO,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import InfoBlue from "components/icons/version-2/InfoBlue";
import { Button } from "components/ui/Button";
import { FinalExpenseEnrollResponseModal } from "./FinalExpenseEnrollResponseModal";
import styles from "./PlanDetailsContainer.module.scss";
import { getPlanEnrollBody } from "./PlanDetailsContainer.utils";
import { PrescreenModal } from "./PrescreenModal";
import { SingleSignOnModal } from "components/FinalExpensePlansContainer/SingleSignOnModal";
import { GRADEDMODIFIED, GRADED_MODIFIED } from "./PlanDetailsContainer.constants";
import { convertToTitleCase } from "utils/toTitleCase";
import { set } from "date-fns";
import Spinner from "components/ui/Spinner";

export const PlanCard = ({
    isMobile,
    planName,
    logoUrl,
    resource_url,
    naic,
    coverageType,
    coverageAmount,
    monthlyPremium,
    eligibility,
    conditionList,
    benefits = [],
    isHaveCarriers,
    writingAgentNumber,
    contactId,
    selectedTab,
    carrierInfo,
    isRTSPlan,
    planType,
    fetchPlans,
    reason,
    limits
}) => {
    const [isPrescreenModalOpen, setIsPrescreenModalOpen] = useState(false);
    const [isSingleSignOnModalOpen, setIsSingleSignOnModalOpen] = useState(false);
    const { leadDetails } = useLeadDetails();
    const { fireEvent } = useAnalytics();
    const { agentInformation } = useAgentInformationByID();
    const { agentFirstName, agentLastName } = agentInformation;
    const { Post: enrollLeadFinalExpensePlan } = useFetch(`${ENROLLEMENT_SERVICE}${contactId}/naic/${naic}`);
    const [enrollResponse, setEnrollResponse] = useState(null);
    const [isLoadingEnroll, setIsLoadingEnroll] = useState(false);

    const onPreApply = async () => {
        fireEvent("Life Apply CTA Clicked", {
            leadid: contactId,
            line_of_business: "Life",
            product_type: "final_expense",
            enabled_filters: [],
            coverage_vs_premium: selectedTab,
            coverage_amount: coverageAmount,
            premium_amount: monthlyPremium,
            coverage_type_selected: coverageType,
            pre_screening_status: eligibility,
            carrier_group: null,
            carrier: null,
        });

        // if (!isRTSPlan) {
        //     setIsSingleSignOnModalOpen(true);
        // } else {
        //     await onApply();
        //     await fetchPlans();
        // }
        setIsLoadingEnroll(true);
        await onApply();
    };

    const onApply = async (producerId) => {
        const writingAgentNumberToSend = writingAgentNumber ?? producerId;
        const body = getPlanEnrollBody(
            writingAgentNumberToSend,
            agentFirstName,
            agentLastName,
            leadDetails,
            coverageAmount,
            planName,
            resource_url,
            contactId,
            planType
        );
        const response = await enrollLeadFinalExpensePlan(body);
        setIsLoadingEnroll(false);
        if (response.RedirectUrl) {
            fireEvent("Life SSO Completed", {
                leadid: contactId,
                success: "Yes",
            });
            window.open(response.RedirectUrl, "_blank");
        } else {
            setEnrollResponse(response);
            fireEvent("Life SSO Completed", {
                leadid: contactId,
                success: "No",
            });
        }
    };

    const renderBenefits = () => (
        <table>
            <thead>
                <tr>
                    <th>{PLAN_INFO}</th>
                    <th>{benefits[0][0]}</th>
                    <th>{benefits[0][1]}</th>
                </tr>
            </thead>
            <tbody>
                {benefits.slice(1).map((benefit, index) => (
                    <tr key={index}>
                        <td></td>
                        <td>{benefit[0]}</td>
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
                pre_screening_status: eligibility,
                carrier_group: null,
                carrier: null,
            });
        }
    }, [
        isPrescreenModalOpen,
        contactId,
        fireEvent,
        selectedTab,
        coverageAmount,
        monthlyPremium,
        coverageType,
        eligibility,
    ]);

    // Safely rendering coverageAmount using optional chaining and nullish coalescing
    const safeCoverageAmount = coverageAmount?.toLocaleString() ?? "N/A";

    return (
        <div className={styles.planBox}>
            <div className={styles.header}>
                <div>{planName}</div>
                {logoUrl && <img src={logoUrl} alt="plan logo" className={styles.logo} />}
            </div>
            <div>
                <span className={styles.label}>{COVERAGE_TYPE}</span>
                <span>{coverageType === GRADED_MODIFIED ? GRADEDMODIFIED : convertToTitleCase(coverageType)}</span>
            </div>
            <div className={`${styles.additionalInfo} ${isMobile ? styles.column : ""}`}>
                <div className={styles.amountInfo}>
                    <div className={styles.coverageAmount}>
                        <div>{COVERAGE_AMOUNT}</div>
                        <div className={styles.amount}>${safeCoverageAmount}</div>
                    </div>
                    <div className={styles.separator}></div>
                    <div>
                        <div>{MONTHLY_PREMIUM}</div>
                        <div className={styles.amount}>
                            ${monthlyPremium}
                            <span className={styles.unit}>/mo</span>
                        </div>
                    </div>
                </div>
                {benefits.length > 0 && (
                    <>
                        <div className={styles.horizSeparator}></div>
                        <div className={styles.flex}>{renderBenefits()}</div>
                    </>
                )}
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
                reason={reason}
                limits={limits}
            />
            <FinalExpenseEnrollResponseModal
                isOpen={enrollResponse !== null}
                onClose={() => setEnrollResponse(null)}
                enrollResponse={enrollResponse}
            />
            <SingleSignOnModal
                isOpen={isSingleSignOnModalOpen}
                onClose={() => setIsSingleSignOnModalOpen(false)}
                carrierInfo={carrierInfo}
                resourceUrl={resource_url}
                onApply={onApply}
            />
            {isLoadingEnroll && <div className={styles.spinner}><Spinner /></div>}
            <div className={styles.applyCTA}>
                <Button
                    label={APPLY}
                    disabled={!isHaveCarriers || !isRTSPlan}
                    onClick={onPreApply}
                    type="primary"
                    icon={<ButtonCircleArrow />}
                    iconPosition="right"
                    className={`${styles.applyButton} ${!isHaveCarriers || !isRTSPlan ? styles.disabled : ""}`}
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
    coverageAmount: PropTypes.number, // Updated to be optional
    monthlyPremium: PropTypes.number.isRequired,
    eligibility: PropTypes.string.isRequired,
    benefits: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    isHaveCarriers: PropTypes.bool.isRequired,
    selectedTab: PropTypes.string.isRequired,
    carrierInfo: PropTypes.object,
    isRTSPlan: PropTypes.bool,
    planType: PropTypes.string.isRequired,
    fetchPlans: PropTypes.func,
    limits: PropTypes.arrayOf(PropTypes.shape({
        maxAge: PropTypes.number,
        maxAmount: PropTypes.number,
        minAge: PropTypes.number,
        minAmount: PropTypes.number,
    })),
    reason: PropTypes.shape({
        MaxAgeExceeded: PropTypes.bool,
        MaxFaceAmountExceeded: PropTypes.bool,
        MinAgeNotMet: PropTypes.bool,
        MinFaceAmountNotMet: PropTypes.bool,
        build: PropTypes.bool,
    }),
};

PlanCard.defaultProps = {
    coverageType: "", // Provide a default null value for coverageAmount
};