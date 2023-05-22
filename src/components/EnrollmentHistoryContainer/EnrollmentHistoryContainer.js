import React, { useState, useEffect, useMemo } from "react";
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import EnrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";

import styles from "./EnrollmentHistoryContainer.module.scss";

const data = [
  {
    agentNpn: "17138811",
    leadId: "2288457",
    policyNumber: "522914424",
    plan: "1jzrm179w3",
    carrier: null,
    policyStatus: "submitted",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2023-12-11T00:00:00",
    appSubmitDate: "2023-11-29T00:00:00",
    hasPlanDetails: false,
  },
  {
    agentNpn: "17138811",
    leadId: "2288457",
    policyNumber: "522914424",
    plan: "1jzrm179w3",
    carrier: null,
    policyStatus: "started",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2023-12-11T00:00:00",
    appSubmitDate: "2023-11-29T00:00:00",
    hasPlanDetails: false,
  },
  {
    agentNpn: "17138811",
    leadId: "2288457",
    policyNumber: "522914424",
    plan: "1jzrm179w3",
    carrier: null,
    policyStatus: "Approved Upcoming",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2023-03-18T00:00:00",
    appSubmitDate: "2023-10-28T00:00:00",
    hasPlanDetails: false,
  },
  {
    agentNpn: "17238811",
    leadId: "2281457",
    policyNumber: "542914424",
    plan: "1jzrm170w3",
    carrier: null,
    policyStatus: "Declined",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2023-04-18T00:00:00",
    appSubmitDate: "2023-04-28T00:00:00",
    hasPlanDetails: false,
  },
  {
    agentNpn: "17138811",
    leadId: "2288457",
    policyNumber: "522914424",
    plan: "1jzrm179w3",
    carrier: null,
    policyStatus: "submitted",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2022-03-18T00:00:00",
    appSubmitDate: "2022-08-18T00:00:00",
    hasPlanDetails: false,
  },
  {
    agentNpn: "17138811",
    leadId: "2288457",
    policyNumber: "522914424",
    plan: "1jzrm179w3",
    carrier: null,
    policyStatus: "submitted",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2021-03-18T00:00:00",
    appSubmitDate: "2023-03-28T00:00:00",
    hasPlanDetails: false,
  },
  {
    agentNpn: "17138811",
    leadId: "2288457",
    policyNumber: "522914424",
    plan: "1jzrm179w3",
    carrier: null,
    policyStatus: "submitted",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2020-03-18T00:00:00",
    appSubmitDate: "2023-02-18T00:00:00",
    hasPlanDetails: false,
  },
  {
    agentNpn: "17138811",
    leadId: "2288457",
    policyNumber: "522914424",
    plan: "1jzrm179w3",
    carrier: null,
    policyStatus: "submitted",
    consumerSource: "Medicare Center",
    confirmationNumber: "dVzSPUzwJV",
    consumerFirstName: "arsenio",
    consumeLastName: "assin",
    policyEffectiveDate: "2019-03-18T00:00:00",
    appSubmitDate: "2023-04-18T00:00:00",
    hasPlanDetails: false,
  },
];

export default function EnrollmentHistoryContainer({ leadId }) {
  const [enrollPlans, setEnrollPlans] = useState([]);
  const addToast = useToast();

  useEffect(() => {
    const fetchEnrollPlans = async () => {
      try {
        const items = await EnrollPlansService.getEnrollPlans("2288457");
        setEnrollPlans(data || items);
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to get Enroll Plans List.",
          time: 10000,
        });
      }
    };
    fetchEnrollPlans();
  }, [addToast]);

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
    enrollPlans?.length > 0 && (
      <ContactSectionCard
        title="Plans"
        className={styles.enrollmentPlanContainer}
      >
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
              />
            ))}
          </>
        )}
      </ContactSectionCard>
    )
  );
}
