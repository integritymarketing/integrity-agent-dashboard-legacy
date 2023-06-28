import React, { useState, useEffect, useMemo } from "react";
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import EnrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import styles from "./EnrollmentHistoryContainer.module.scss";

export default function EnrollmentHistoryContainer({ leadId }) {
  const [enrollPlans, setEnrollPlans] = useState([]);
  const addToast = useToast();

  useEffect(() => {
    const fetchEnrollPlans = async () => {
      try {
        const items = await EnrollPlansService.getEnrollPlans(leadId);
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
  }, [addToast, leadId]);

  function getCurrentYear(date) {
    return date ? new Date(date).getFullYear() : null;
  }

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const currentYearPlansData = enrollPlans.filter(
    (planData) => getCurrentYear(planData.policyEffectiveDate) === currentYear
  );

  const previousYearPlansData = enrollPlans.filter(
    (planData) => getCurrentYear(planData.policyEffectiveDate) !== currentYear
  );
  const formattedName = (str) => {
    const capitalize = (word) => {
      return word
        .toLowerCase()
        .replace(/\b[a-z]/g, (char) => char.toUpperCase());
    };

    return str.split(" ").map(capitalize).join(" ");
  };

  return (
    <ContactSectionCard
      title="Plans"
      className={styles.enrollmentPlanContainer_detailsPage}
    >
      {enrollPlans?.length > 0 ? (
        <>
          {currentYearPlansData?.length > 0 &&
            currentYearPlansData.map((planData, index) => {
              const policyHolderName = `${planData.consumerFirstName} ${planData.consumeLastName}`;
              return (
                <EnrollmentPlanCard
                  key={`${planData.policyId + index.toString()}`}
                  currentYear={planData.currentYear}
                  submittedDate={planData.appSubmitDate}
                  enrolledDate={planData.enrolledDate}
                  effectiveDate={planData.policyEffectiveDate}
                  policyId={planData.policyNumber}
                  policyHolder={formattedName(policyHolderName)}
                  leadId={leadId}
                  planId={planData.plan}
                  agentNpn={planData.agentNpn}
                  carrier={planData.carrier}
                  consumerSource={planData.consumerSource}
                  hasPlanDetails={planData.hasPlanDetails}
                  policyStatus={planData.policyStatus}
                  confirmationNumber={planData.confirmationNumber}
                  page="Contacts Details"
                  planName={planData.planName}
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
                  policyHolder={`${planData.consumerFirstName} ${planData.consumeLastName}`}
                  leadId={leadId}
                  planId={planData.plan}
                  agentNpn={planData.agentNpn}
                  carrier={planData.carrier}
                  consumerSource={planData.consumerSource}
                  hasPlanDetails={planData.hasPlanDetails}
                  policyStatus={planData.policyStatus}
                  confirmationNumber={planData.confirmationNumber}
                  page="Contacts Details"
                  planName={planData.planName}
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
