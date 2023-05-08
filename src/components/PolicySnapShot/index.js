import React from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import PolicyCountCards from "./PolicyCountCards";
import PolicyList from "./PolicyList";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import styles from "./styles.module.scss";

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
    >
      <div className={styles.policySnapshotContainer}>
        <PolicyCountCards />
        {!isMobile && <PolicyList />}
      </div>
    </ContactSectionCard>
  );
}
