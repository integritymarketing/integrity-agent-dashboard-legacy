import React, { useEffect, useMemo } from "react";
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

    function getCurrentYear(date) {
        return date ? new Date(date).getFullYear() : null;
    }

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const currentYearPlansData = enrollPlansList?.filter((planData) => {
        let policyDate = new Date(planData?.policyEffectiveDate); // get the current date
        policyDate?.setDate(policyDate.getDate() + 1); // add 1 day
        return getCurrentYear(policyDate) === currentYear;
    });

    const previousYearPlansData = enrollPlansList?.filter((planData) => {
        let policyDate = new Date(planData?.policyEffectiveDate); // get the current date
        policyDate?.setDate(policyDate.getDate() + 1); // add 1 day
        return getCurrentYear(policyDate) !== currentYear;
    });

    const currentYearPlansCount = currentYearPlansData?.length;
    const previousYearPlansCount = previousYearPlansData?.length;

    return (
        <>
            <ContactSectionCard
                title={<p>Current Policies <span className={styles.plansCount}>({currentYearPlansCount})</span></p>}
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {currentYearPlansCount > 0 ? (
                    <>
                        {currentYearPlansCount > 0 &&
                            currentYearPlansData.map((planData, index) => {
                                const policyHolderName = `${planData.consumerFirstName} ${planData.consumerLastName}`;
                                return (
                                    <EnrollmentPlanCard
                                        key={`${planData.policyId + index.toString()}`}
                                        currentYear={true}
                                        submittedDate={planData.submitDate || "Not Provided by Carrier"}
                                        enrolledDate={planData.enrolledDate}
                                        policyEffectiveDate={planData.policyEffectiveDate}
                                        policyId={planData.policyNumber}
                                        policyHolder={policyHolderName}
                                        leadId={leadId}
                                        planId={planData.planId}
                                        agentNpn={planData.agentNpn}
                                        carrier={planData.carrier}
                                        consumerSource={planData.consumerSource}
                                        hasPlanDetails={planData.hasPlanDetails}
                                        policyStatus={planData.policyStatus}
                                        confirmationNumber={planData.confirmationNumber}
                                        page="Contacts Details"
                                        planName={planData.planName}
                                        termedDate={planData.termedDate}
                                        sourceId={planData.sourceId}
                                        policyStatusColor={planData.policyStatusColor}
                                        linkingType={planData.linkingType}
                                    />
                                );
                            })}
                    </>
                ) : (
                    <div className={styles.noPlansAvailable}>
                        <div>There is no policy information available for this contact at this time. For more information about policy data, please view our guides.</div>
                        <a href={FINAL_EXPENSE_GUIDE_LINK} target="_blank" >Final Expense Policy Data Guide</a>
                        <a href={MEDICARE_GUIDE_LINK} target="_blank" >Medicare Policy Data Guide</a>
                    </div>
                )}
            </ContactSectionCard>
            <ContactSectionCard
                title={<p>Previous Policies <span className={styles.plansCount}>({previousYearPlansCount})</span></p>}
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {previousYearPlansCount > 0 ? (
                    <>
                        {previousYearPlansCount > 0 && (
                            <>
                                {previousYearPlansData.map((planData, index) => (
                                    <EnrollmentPlanCard
                                        key={`${planData.policyId + index.toString()}`}
                                        currentYear={false}
                                        submittedDate={planData.submitDate || "Not Provided by Carrier"}
                                        enrolledDate={planData.enrolledDate}
                                        policyEffectiveDate={planData.policyEffectiveDate}
                                        policyId={planData.policyNumber}
                                        policyHolder={`${planData.consumerFirstName} ${planData.consumerLastName}`}
                                        leadId={leadId}
                                        planId={planData.planId}
                                        agentNpn={planData.agentNpn}
                                        carrier={planData.carrier}
                                        consumerSource={planData.consumerSource}
                                        hasPlanDetails={planData.hasPlanDetails}
                                        policyStatus={planData.policyStatus}
                                        confirmationNumber={planData.confirmationNumber}
                                        page="Contacts Details"
                                        planName={planData.planName}
                                        termedDate={planData.termedDate}
                                        policyStatusColor={planData.policyStatusColor}
                                        sourceId={planData.sourceId}
                                        linkingType={planData.linkingType}
                                    />
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <div className={styles.noPlansAvailable}>
                        <div>There is no previous policy information available for this contact at this time. For more information about policy data, please view our guides.</div>
                        <a href={FINAL_EXPENSE_GUIDE_LINK} target="_blank">Final Expense Policy Data Guide</a>
                        <a href={MEDICARE_GUIDE_LINK} target="_blank">Medicare Policy Data Guide</a>
                    </div>
                )}
            </ContactSectionCard>
        </>
    );
}