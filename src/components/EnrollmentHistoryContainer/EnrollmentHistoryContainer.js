import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import { usePolicies } from "providers/ContactDetails/ContactDetailsContext";
import styles from "./EnrollmentHistoryContainer.module.scss";
import { FINAL_EXPENSE_GUIDE_LINK, MEDICARE_GUIDE_LINK } from "./EnrollmentHistoryContainer.constants";
import { useLeadDetails } from "providers/ContactDetails";
import useAnalytics from "hooks/useAnalytics";

const convertCategoryName = (categoryName) => {
    const categoryMap = {
        "Medicare Advantage": "ma",
        "Medicare Advantage Prescription Drug": "mapd",
        "Prescription Drug Plans": "pdp",
        "Final Expense": "final_expense",
        "Part D": "pdp",
        "Medicare Supliment": "mapd",
    };

    return categoryMap[categoryName] || categoryName;
};

export default function EnrollmentHistoryContainer({ leadId }) {
    const { getEnrollPlansList, enrollPlansList } = usePolicies();
    const { leadDetails } = useLeadDetails();
    const { fireEvent } = useAnalytics();

    useEffect(() => {
        getEnrollPlansList(leadId);
    }, [getEnrollPlansList, leadId]);

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const isDeclinedStatus = (status) => {
        return status === "declined" || status === "inactive";
    };

    const filterPlansByRollingYear = (plansList, isCurrentPeriod) => {
        const currentDate = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setDate(currentDate.getDate() - 365);

        return plansList.filter((plan) => {
            // For Final Expense plans, inclusion is based solely on the policyStatus.
            if (plan.productCategory === "Final Expense") {
                const isInCurrentPeriodBasedOnStatus = !isDeclinedStatus(plan.policyStatus);
                return isCurrentPeriod ? isInCurrentPeriodBasedOnStatus : !isInCurrentPeriodBasedOnStatus;
            }

            // For non-Final Expense plans, use the policyEffectiveDate to determine the date.
            const effectiveDate = plan.policyEffectiveDate ? new Date(plan.policyEffectiveDate) : null;

            if (effectiveDate) {
                if (isCurrentPeriod) {
                    // Include if the policyEffectiveDate is within the last 365 days and not declined/inactive.
                    return (
                        effectiveDate >= oneYearAgo &&
                        effectiveDate <= currentDate &&
                        !isDeclinedStatus(plan.policyStatus)
                    );
                } else {
                    // Include if the policyEffectiveDate is more than 365 days ago.
                    return effectiveDate < oneYearAgo;
                }
            }
            return false;
        });
    };

    const currentYearPlansData = useMemo(() => filterPlansByRollingYear(enrollPlansList, true), [enrollPlansList]);
    const previousYearPlansData = useMemo(
        () => filterPlansByRollingYear(enrollPlansList, false),
        [enrollPlansList]
    );

    useEffect(() => {
        const active_product_types = currentYearPlansData.map((plan) => convertCategoryName(plan.productCategory));
        const inactive_product_types = previousYearPlansData.map((plan) => convertCategoryName(plan.productCategory));

        fireEvent("Contact Policies Page Viewed", {
            leadid: leadId,
            plan_enroll_profile_created: leadDetails?.plan_enroll_profile_created,
            tags: leadDetails?.leadTags,
            stage: leadDetails?.statusName,
            active_product_types,
            inactive_product_types,
        });
    }, [enrollPlansList, leadDetails, leadId, fireEvent]);

    const renderPlans = (plansData, isCurrentYear) =>
        plansData.length > 0 ? (
            plansData.map((plan, index) => (
                <EnrollmentPlanCard
                    key={`${plan.policyId}-${index}`}
                    currentYear={isCurrentYear}
                    submittedDate={plan.submitDate || "Not Provided by Carrier"}
                    enrolledDate={plan.enrolledDate}
                    policyEffectiveDate={plan.policyEffectiveDate}
                    policyId={plan.policyNumber}
                    policyHolder={`${plan.consumerFirstName} ${plan.consumerLastName}`}
                    leadId={leadId}
                    planId={plan.planId}
                    agentNpn={plan.agentNpn}
                    carrier={plan.carrier}
                    consumerSource={plan.consumerSource}
                    hasPlanDetails={plan.hasPlanDetails}
                    policyStatus={plan.policyStatus}
                    confirmationNumber={plan.confirmationNumber}
                    page="Contacts Details"
                    planName={plan.planName}
                    termedDate={plan.termedDate}
                    policyStatusColor={plan.policyStatusColor}
                    sourceId={plan.sourceId}
                    linkingType={plan.linkingType}
                    productCategory={plan.productCategory}
                />
            ))
        ) : (
            <NoPlansAvailable guideLink={isCurrentYear ? FINAL_EXPENSE_GUIDE_LINK : MEDICARE_GUIDE_LINK} />
        );

    return (
        <>
            <ContactSectionCard
                customStyle={styles.width}
                title={
                    <p>
                        Current Policies <span className={styles.plansCount}>({currentYearPlansData.length})</span>
                    </p>
                }
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {renderPlans(currentYearPlansData, true)}
            </ContactSectionCard>
            <ContactSectionCard
                customStyle={styles.width}
                title={
                    <p>
                        Previous Policies <span className={styles.plansCount}>({previousYearPlansData.length})</span>
                    </p>
                }
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {renderPlans(previousYearPlansData, false)}
            </ContactSectionCard>
        </>
    );
}

EnrollmentHistoryContainer.propTypes = {
    leadId: PropTypes.string.isRequired,
};

const NoPlansAvailable = ({ guideLink }) => (
    <div className={styles.noPlansAvailable}>
        <div>
            There is no policy information available for this contact at this time. For more information about policy
            data, please view our guides.
        </div>
        <a href={guideLink} target="_blank" rel="noopener noreferrer">
            Policy Data Guide
        </a>
    </div>
);

NoPlansAvailable.propTypes = {
    guideLink: PropTypes.string.isRequired,
};
