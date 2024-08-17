import { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import { usePolicies } from "providers/ContactDetails/ContactDetailsContext";
import styles from "./EnrollmentHistoryContainer.module.scss";
import { FINAL_EXPENSE_GUIDE_LINK, MEDICARE_GUIDE_LINK } from "./EnrollmentHistoryContainer.constants";
import { useLeadDetails } from "providers/ContactDetails";
import useAnalytics from "hooks/useAnalytics";
import NoPlansAvailable from "./NoPlansAvailable";

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

    const filterPlansByPolicyStatus = useCallback((plans, statuses) => {
        return plans.filter((plan) => statuses.includes(plan.policyStatus));
    }, []);

    const currentPoliciesPlansData = useMemo(
        () => filterPlansByPolicyStatus(enrollPlansList, ["Active"]),
        [enrollPlansList, filterPlansByPolicyStatus]
    );

    const previousPoliciesPlansData = useMemo(
        () => filterPlansByPolicyStatus(enrollPlansList, ["Terminated", "Declined"]),
        [enrollPlansList, filterPlansByPolicyStatus]
    );

    const pendingPoliciesPlansData = useMemo(
        () => filterPlansByPolicyStatus(enrollPlansList, ["Pending", "Applied", "Started", "Upcoming", "Submitted"]),
        [enrollPlansList, filterPlansByPolicyStatus]
    );

    useEffect(() => {
        const active_product_types = currentPoliciesPlansData.map((plan) => convertCategoryName(plan.productCategory));
        const inactive_product_types = previousPoliciesPlansData.map((plan) =>
            convertCategoryName(plan.productCategory)
        );

        fireEvent("Contact Policies Page Viewed", {
            leadid: leadId,
            plan_enroll_profile_created: leadDetails?.plan_enroll_profile_created,
            tags: leadDetails?.leadTags,
            stage: leadDetails?.statusName,
            active_product_types,
            inactive_product_types,
        });
    }, [currentPoliciesPlansData, previousPoliciesPlansData, leadDetails, leadId, fireEvent]);

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
                    policyStatus={plan.policyStatus ? plan.policyStatus?.toLowerCase() : ""}
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
                        Pending Policies <span className={styles.plansCount}>({pendingPoliciesPlansData.length})</span>
                    </p>
                }
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {renderPlans(pendingPoliciesPlansData, true)}
            </ContactSectionCard>
            <ContactSectionCard
                customStyle={styles.width}
                title={
                    <p>
                        Current Policies <span className={styles.plansCount}>({currentPoliciesPlansData.length})</span>
                    </p>
                }
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {renderPlans(currentPoliciesPlansData, true)}
            </ContactSectionCard>
            <ContactSectionCard
                customStyle={styles.width}
                title={
                    <p>
                        Previous Policies{" "}
                        <span className={styles.plansCount}>({previousPoliciesPlansData.length})</span>
                    </p>
                }
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {renderPlans(previousPoliciesPlansData, false)}
            </ContactSectionCard>
        </>
    );
}

EnrollmentHistoryContainer.propTypes = {
    leadId: PropTypes.string.isRequired,
};
