import React, { useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import { usePolicies } from "providers/ContactDetails/ContactDetailsContext";
import styles from "./EnrollmentHistoryContainer.module.scss";
import { FINAL_EXPENSE_GUIDE_LINK, MEDICARE_GUIDE_LINK } from "./EnrollmentHistoryContainer.constants";

export default function EnrollmentHistoryContainer({ leadId }) {
    const { getEnrollPlansList, enrollPlansList } = usePolicies();

    useEffect(() => {
        getEnrollPlansList(leadId);
    }, [getEnrollPlansList, leadId]);

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const filterPlansByYear = (plansList, year, isCurrentYear) => {
        return plansList?.filter(({ policyEffectiveDate, termedDate, policyStatus, productCategory }) => {
            const policyDate = new Date(policyEffectiveDate);
            policyDate.setDate(policyDate.getDate() + 1);
            const policyYear = policyDate.getFullYear();
            const isTermedInPast = termedDate && new Date(termedDate) < new Date();
            const isDeclined = policyStatus === 'declined' || (policyStatus === 'inactive' && productCategory === 'Final Expense');
            return isCurrentYear ? (policyYear === year && !isDeclined) : (policyYear !== year || isTermedInPast || isDeclined);
        });
    };

    const currentYearPlansData = filterPlansByYear(enrollPlansList, currentYear, true);
    const previousYearPlansData = filterPlansByYear(enrollPlansList, currentYear, false);

    const renderPlans = (plansData, isCurrentYear) => (
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
        )
    );

    return (
        <>
            <ContactSectionCard
                title={<p>Current Policies <span className={styles.plansCount}>({currentYearPlansData.length})</span></p>}
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {renderPlans(currentYearPlansData, true)}
            </ContactSectionCard>
            <ContactSectionCard
                title={<p>Previous Policies <span className={styles.plansCount}>({previousYearPlansData.length})</span></p>}
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
        <div>There is no policy information available for this contact at this time. For more information about policy data, please view our guides.</div>
        <a href={guideLink} target="_blank" rel="noopener noreferrer">Policy Data Guide</a>
    </div>
);

NoPlansAvailable.propTypes = {
    guideLink: PropTypes.string.isRequired,
};
