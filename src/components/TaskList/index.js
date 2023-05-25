import React from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import DateRangeSort from "../DateRangeSort";
import styles from "./styles.module.scss";
import TabsCard from "components/TabsCard";
import UnLinkedCalls from "pages/dashbaord/UnLinkedCalls";

const DEFAULT_TABS = [
  {
    heading: "Requested Callbacks",
    value: 3,
  },
  {
    heading: "Reminders",
    value: 34,
  },
  {
    heading: "Unlinked Calls",
    value: 4,
  },
  {
    heading: "Unlinked Policies",
    value: 8,
  },
];

export default function TaskList({ isMobile }) {
  return (
    <ContactSectionCard
      title="Task List"
      className={styles.enrollmentPlanContainer}
      actions={
        <DateRangeSort isMobile={isMobile} preferencesKey={"taskList_sort"} />
      }
      preferencesKey={"taskList_collapse"}
    >
      <TabsCard tabs={DEFAULT_TABS} preferencesKey={"taskList_widget"} />
      <UnLinkedCalls />
    </ContactSectionCard>
  );
}
