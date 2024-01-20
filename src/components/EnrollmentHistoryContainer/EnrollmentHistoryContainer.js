import React, { useEffect, useMemo, useState } from "react";

import { usePolicies } from "providers/ContactDetails/ContactDetailsContext";

import useAnalytics from "hooks/useAnalytics";

import ContactSectionCard from "../../packages/ContactSectionCard";

import styles from "./EnrollmentHistoryContainer.module.scss";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";

export default function EnrollmentHistoryContainer({ leadId }) {
    const { getEnrollPlansList, enrollPlansList } = usePolicies();
    const { fireEvent } = useAnalytics();

    useEffect(() => {
        fireEvent("Contact Policies Page Viewed", {
            leadid: leadId,
        });
    }, [leadId]);

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

    fireEvent("Contact Overview Page Viewed", {
        leadid: leadsId,
        selection: "start_quote",
        tags: leadTags,
        stage: statusName,
        plan_enroll_profile_created: true, // TODO-EVENT: Need to update this value
    });

    return (
        <>
            <ContactSectionCard
                title="Current Policies"
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {currentYearPlansData?.length > 0 ? (
                    <>
                        {currentYearPlansData?.length > 0 &&
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
                    <div className={styles.noPlansAvailable}>No Plans Available</div>
                )}
            </ContactSectionCard>
            <ContactSectionCard
                title="Previous Policies"
                className={styles.layout}
                isDashboard
                contentClassName={styles.content}
            >
                {previousYearPlansData?.length > 0 ? (
                    <>
                        {previousYearPlansData?.length > 0 && (
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
                    <div className={styles.noPlansAvailable}>No Plans Available</div>
                )}
            </ContactSectionCard>
        </>
    );
}
