import React, { useState } from "react";
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
  const [showUnLinkedCalls, setShowUnLinkedCalls] = useState(false);

  // we can pass card info here and accordingly set the show to true as per card
  const handleTaskClick = (heading) => {
    switch (heading) {
      case "Unlinked Calls":
        setShowUnLinkedCalls(true);
        break;
      default:
        setShowUnLinkedCalls(false);
        break;
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
      {showUnLinkedCalls && <UnLinkedCalls />}
    </ContactSectionCard>
  );
}
