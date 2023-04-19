import React from "react";
import ContactSectionCard from "../../packages/ContactSectionCard";
import EnrollmentPlanCard from "./EnrollmentPlanCard/EnrollmentPlanCard";
import styles from "./EnrollmentHistoryContainer.module.scss";

const mockData = [
  {
    submittedDate: "11/12/2022",
    enrolledDate: "12/05/22",
    effectiveDate: "01/01/23",
    policyHolder: "Robert Zimmerman",
    policyId: "6845845",
    currentYear: true,
  },
  {
    submittedDate: "12/12/2022",
    enrolledDate: "12/12/22",
    effectiveDate: "01/11/23",
    policyHolder: "Zimmerman Robert",
    policyId: "6745845",
    currentYear: false,
  },
];

export default function EnrollmentHistoryContainer({ leadId }) {
  return (
    <ContactSectionCard
      title="Plans"
      className={styles.enrollmentPlanContainer}
    >
      {mockData.map((planData) => (
        <EnrollmentPlanCard
          key={planData.policyId}
          currentYear={planData.currentYear}
          submittedDate={planData.submittedDate}
          enrolledDate={planData.enrolledDate}
          effectiveDate={planData.effectiveDate}
          policyHolder={planData.policyHolder}
          policyId={planData.policyId}
          leadId={leadId}
        />
      ))}
    </ContactSectionCard>
  );
}
