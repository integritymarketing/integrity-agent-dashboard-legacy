import React, { useState, useEffect, useMemo } from "react";
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import enrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import styles from "./EnrollmentHistoryContainer.module.scss";

export default function EnrollmentHistoryContainer({ leadId }) {
    const [enrollPlans, setEnrollPlans] = useState([]);
    const showToast = useToast();

    useEffect(() => {
        const fetchEnrollPlans = async () => {
            try {
                const items = await enrollPlansService.getEnrollPlans(leadId);
                setEnrollPlans(items);
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Failed to get Enroll Plans List.",
                    time: 10000,
                });
            }
        };
        fetchEnrollPlans();
    }, [showToast, leadId]);

    function getCurrentYear(date) {
        return date ? new Date(date).getFullYear() : null;
    }

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const currentYearPlansData = enrollPlans?.filter((planData) => {
        let policyDate = new Date(planData?.policyEffectiveDate); // get the current date
        policyDate?.setDate(policyDate.getDate() + 1); // add 1 day
        return getCurrentYear(policyDate) === currentYear;
    });

    const previousYearPlansData = enrollPlans?.filter((planData) => {
        let policyDate = new Date(planData?.policyEffectiveDate); // get the current date
        policyDate?.setDate(policyDate.getDate() + 1); // add 1 day
        return getCurrentYear(policyDate) !== currentYear;
    });

    if (!enrollPlans || enrollPlans?.length === 0) return null;
    return (
        <ContactSectionCard
            title="Plans"
            className={styles.enrollmentPlanContainer_detailsPage}
        >
            {enrollPlans?.length > 0 ? (
                <>
                    {currentYearPlansData?.length > 0 &&
                        currentYearPlansData.map((planData, index) => {
                            const policyHolderName = `${planData.consumerFirstName} ${planData.consumerLastName}`;
                            return (
                                <EnrollmentPlanCard
                                    key={`${planData.policyId + index.toString()}`}
                                    currentYear={true}
                                    submittedDate={
                                        planData.submitDate || "Not Provided by Carrier"
                                    }
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
                    {previousYearPlansData?.length > 0 && (
                        <>
                            <div className={styles.previousYearPlanTitle}>Plan History</div>
                            {previousYearPlansData.map((planData, index) => (
                                <EnrollmentPlanCard
                                    key={`${planData.policyId + index.toString()}`}
                                    currentYear={false}
                                    submittedDate={
                                        planData.submitDate || "Not Provided by Carrier"
                                    }
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
                <div className="no-items">No Plans Available</div>
            )}
        </ContactSectionCard>
    );
}