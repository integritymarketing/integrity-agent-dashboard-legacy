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

    const isDeclinedStatus = (status) => {
        return status === 'declined' || status === 'inactive';
    };

    const getUniqueIdentifiers = (plan) => {
        return [plan.sourceId, plan.policyNumber, plan.confirmationNumber].filter(id => id != null);
    };

    const filterPlansByYear = (plansList, year, isCurrentYear, excludeIdentifiers = []) => {
        return plansList?.filter(({ policyEffectiveDate, policyStatus, productCategory, ...plan }) => {
            const policyDate = new Date(policyEffectiveDate);
            policyDate.setDate(policyDate.getDate() + 1);
            const policyYear = policyDate.getFullYear();

            const planIdentifiers = getUniqueIdentifiers(plan);
            if (planIdentifiers.some(id => excludeIdentifiers.includes(id))) {
                return false;
            }

            if (productCategory === 'Final Expense') {
                return isCurrentYear ? false : policyYear !== year && isDeclinedStatus(policyStatus);
            }

            return isCurrentYear ? policyYear === year : policyYear !== year;
        });
    };

    const currentYearPlansData = filterPlansByYear(enrollPlansList, currentYear, true);
    const previousYearExcludedIds = currentYearPlansData.flatMap(getUniqueIdentifiers);
    const previousYearPlansData = filterPlansByYear(enrollPlansList, currentYear, false, previousYearExcludedIds);

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
                customStyle={styles.width}
                title={<p>Current Policies <span className={styles.plansCount}>({currentYearPlansData.length})</span></p>}
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {renderPlans(currentYearPlansData, true)}
            </ContactSectionCard>
            <ContactSectionCard
                customStyle={styles.width}
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