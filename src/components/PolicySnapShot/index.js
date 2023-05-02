import React from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import EnrollmentPlanCard from "./PolicyPlan";
import styles from "./styles.module.scss";

export default function PlanSnapShot({ leadId }) {
  return (
    <ContactSectionCard
      title="Policy Snapshot"
      className={styles.enrollmentPlanContainer}
    >
      <EnrollmentPlanCard />
    </ContactSectionCard>
  );
}
