import React from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import DateRangeSort from "../DateRangeSort";
import WidgetCard from "../WidgetCard/card";
import styles from "./styles.module.scss";

const mockData = [
  {
    status: "Requested Callbacks",
    bgColor: "#deebfb",
    count: "4",
  },
  {
    status: "Reminders",
    bgColor: "#fcf6b0",
    count: "8",
  },
  {
    status: "Unlinked Calls",
    bgColor: "#defbe6",
    count: "34",
  },
  {
    status: "Unlinked Policies",
    bgColor: "#fbdede",
    count: "74",
  },
];

export default function TaskList({ isMobile }) {
  return (
    <ContactSectionCard
      title="Task List"
      className={styles.enrollmentPlanContainer}
      actions={<DateRangeSort isMobile={isMobile} />}
    >
      <div className={styles.policySnapshotContainer}>
        <div className={styles.countCardsContainer}>
          {mockData?.map((card) => {
            return <WidgetCard {...card} />;
          })}
        </div>
      </div>
    </ContactSectionCard>
  );
}
