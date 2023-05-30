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
  const [value] = usePreferences(0, "taskList_collapse");

  const selectedName = DEFAULT_TABS[value]?.heading || "Requested Callbacks";

  const [selectedWidgetName, setSelectedWidgetName] = useState(selectedName);

  // we can pass card info here and accordingly set the show to true as per card
  const handleTaskClick = (heading) => {
    setSelectedWidgetName(heading);
  };

  const renderList = () => {
    switch (selectedWidgetName) {
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
        <DateRangeSort isMobile={isMobile} preferencesKey={"taskList_sort"} />
      }
      preferencesKey={"taskList_collapse"}
    >
      <TabsCard
        handleTaskClick={handleTaskClick}
        tabs={DEFAULT_TABS}
        preferencesKey={"taskList_widget"}
      />
      {renderList()}
    </ContactSectionCard>
  );
}
