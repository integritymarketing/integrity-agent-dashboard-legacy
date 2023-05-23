import React from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import TooltipMUI from "packages/ToolTip";
import DateRangeSort from "../DateRangeSort";
import WidgetCard from "../WidgetCard/card";
import PolicyList from "./PolicyList";
import styles from "./styles.module.scss";

const mockData = [
  {
    status: "Started",
    bgColor: "#deebfb",
    count: "4",
  },
  {
    status: "Applied",
    bgColor: "#fcf6b0",
    count: "8",
  },
  {
    status: "Issued",
    bgColor: "#defbe6",
    count: "34",
  },
  {
    status: "Declined",
    bgColor: "#fbdede",
    count: "74",
  },
];

const TitleData =
  "Policy Snapshot shows the number of contacts that are in each stage for MedicareCENTER only.";

export default function PlanSnapShot({ isMobile }) {
  return (
    <ContactSectionCard
      title="Policy Snapshot"
      className={styles.enrollmentPlanContainer}
      infoIcon={<TooltipMUI titleData={TitleData} />}
      actions={<DateRangeSort />}
    >
      <div className={styles.policySnapshotContainer}>
        <div className={styles.countCardsContainer}>
          {mockData?.map((card) => {
            return <WidgetCard {...card} />;
          })}
        </div>
        {!isMobile && <PolicyList />}
      </div>
    </ContactSectionCard>
  );
}
