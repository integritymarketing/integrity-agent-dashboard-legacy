import React, { useState, useEffect, useMemo } from "react";
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";
import styles from "./EnrollmentHistoryContainer.module.scss";

export default function EnrollmentHistoryContainer({ leadId }) {
  const [enrollPlans, setEnrollPlans] = useState([]);
  const addToast = useToast();
  const { enrollPlansService } = useClientServiceContext();

  useEffect(() => {
    const fetchEnrollPlans = async () => {
      try {
        const items = await enrollPlansService.getEnrollPlans(leadId);
        setEnrollPlans(items);
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to get Enroll Plans List.",
          time: 10000,
        });
      }
    };
    fetchEnrollPlans();
  }, [addToast, leadId, enrollPlansService]);

  function getCurrentYear(date) {
    return date ? new Date(date).getFullYear() : null;
  }

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const currentYearPlansData = enrollPlans.filter((planData) => {
    let policyDate = new Date(planData.policyEffectiveDate); // get the current date
    policyDate.setDate(policyDate.getDate() + 1); // add 1 day
    return getCurrentYear(policyDate) === currentYear;
  });

  const previousYearPlansData = enrollPlans.filter((planData) => {
    let policyDate = new Date(planData.policyEffectiveDate); // get the current date
    policyDate.setDate(policyDate.getDate() + 1); // add 1 day
    return getCurrentYear(policyDate) !== currentYear;
  });

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
                  submittedDate={planData.appSubmitDate}
                  enrolledDate={planData.enrolledDate}
                  effectiveDate={planData.policyEffectiveDate}
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
                  policySourceId={planData.policySourceId}
                  policyStatusColor={planData.policyStatusColor}
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
                  submittedDate={planData.appSubmitDate}
                  enrolledDate={planData.enrolledDate}
                  effectiveDate={planData.policyEffectiveDate}
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
