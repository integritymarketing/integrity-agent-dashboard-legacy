import React, { useState } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import DateRangeSort from "../DateRangeSort";
import styles from "./styles.module.scss";
import TabsCard from "components/TabsCard";
import UnLinkedCalls from "pages/dashbaord/UnLinkedCalls";
import UnlinkedPolicyList from "./UnlinkedPolicies";
import RemindersList from "./Reminders";
import usePreferences from "hooks/usePreferences";

const DEFAULT_TABS = [
  {
    policyStatus: "Requested Callbacks",
    policyCount: 3,
    colorCode: "#FBDEDE",
  },
  {
    policyStatus: "Reminders",
    policyCount: 34,
    colorCode: "#FEF8CB",
  },
  {
    policyStatus: "Unlinked Calls",
    policyCount: 4,
    colorCode: "#DEEBFB",
  },
  {
    policyStatus: "Unlinked Policies",
    policyCount: 8,
    colorCode: "#DEEBFB",
  },
];

export default function TaskList({ isMobile }) {
  const [dRange] = usePreferences(0, "taskList_sort");
  const [index] = usePreferences(0, "taskList_widget");

  const [dateRange, setDateRange] = useState(dRange);
  const [statusIndex, setStatusIndex] = useState(index);

  const selectedName =
    DEFAULT_TABS[statusIndex]?.policyStatus || "Requested Callbacks";

  // we can pass card info here and accordingly set the show to true as per card

  const renderList = () => {
    switch (selectedName) {
      case "Unlinked Calls":
        return <UnLinkedCalls />;
      case "Unlinked Policies":
        return <UnlinkedPolicyList />;
      case "Reminders":
        return <RemindersList />;
      default:
        return <UnlinkedPolicyList />;
    }
  };
  return (
    <ContactSectionCard
      title="Task List"
      className={styles.enrollmentPlanContainer}
      actions={
        <DateRangeSort
          isMobile={isMobile}
          preferencesKey={"taskList_sort"}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      }
      preferencesKey={"taskList_collapse"}
    >
      <TabsCard
        tabs={DEFAULT_TABS}
        preferencesKey={"taskList_widget"}
        statusIndex={statusIndex}
        setStatusIndex={setStatusIndex}
      />
      {renderList()}
    </ContactSectionCard>
  );
}
