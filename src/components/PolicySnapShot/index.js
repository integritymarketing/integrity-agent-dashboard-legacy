import React from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import DateRangeSort from "../DateRangeSort";
import WidgetCard from "../WidgetCard/card";
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

export default function PlanSnapShot({ isMobile }) {
  return (
    <ContactSectionCard
      title="Policy Snapshot"
      className={styles.enrollmentPlanContainer}
      infoIcon={
        <Popover
          openOn="hover"
          icon={<Info />}
          title={"Client Snapshot"}
          description="Client Snapshot shows the number of contacts that are in each stage for MedicareCENTER only."
          positions={["right", "bottom"]}
        >
          <Info />
        </Popover>
      }
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
