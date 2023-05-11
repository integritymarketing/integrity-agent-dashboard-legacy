import React, { useState } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import PolicyCountCards from "./PolicyCountCards";
import PolicyList from "./PolicyList";
import Info from "components/icons/info-blue";
import DateRange from "components/icons/DateRange";
import Popover from "components/ui/Popover";
import Arrow from "components/icons/down";
import { DASHBOARD_SORT_OPTIONS } from "../../constants";
import CheckMark from "packages/ContactListFilterOptions/CheckMarkIcon/CheckMark";

import styles from "./styles.module.scss";

export default function PlanSnapShot({ isMobile }) {
  const [isOpen, setOpen] = useState(false);
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
      actions={
        <div className={styles.sortSelector}>
          <div className={styles.sortButton}>
            <div>
              <DateRange />
            </div>
            <div>Current Year to Date</div>
            <div
              className={`${styles.icon} ${isOpen ? styles.iconReverse : ""}`}
              onClick={() => {
                setOpen(!isOpen);
              }}
            >
              <Arrow color={"#0052CE"} />
            </div>
          </div>
          {isOpen && (
            <div className={styles.options}>
              {DASHBOARD_SORT_OPTIONS.map((option) => {
                return (
                  <div key={`${option.label}`} className={styles.option}>
                    <div>{option.label}</div>
                    <div className={styles.mark}>
                      <CheckMark show={true} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      }
    >
      <div className={styles.policySnapshotContainer}>
        <PolicyCountCards />
        {!isMobile && <PolicyList />}
      </div>
    </ContactSectionCard>
  );
}
