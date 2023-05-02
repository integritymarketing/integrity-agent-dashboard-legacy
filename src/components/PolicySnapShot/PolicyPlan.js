import React from "react";
import styles from "./styles.module.scss";

export default function EnrollmentPlanCard() {
  return (
    <div className={styles.policySnapshotContainer}>
      <div className={styles.countCardsContainer}>
        <div className={styles.counterCard}>
          <div className={styles.countName}>Started</div>
          <div className={styles.countInfo}>
            <div className={`${styles.countColour} ${styles.Started}`}></div>
            <div className={styles.count}>4</div>
          </div>
        </div>
        <div className={styles.counterCard}>
          <div className={styles.countName}>Applied</div>
          <div className={styles.countInfo}>
            <div className={`${styles.countColour} ${styles.Applied}`}></div>
            <div className={styles.count}>8</div>
          </div>
        </div>
        <div className={styles.counterCard}>
          <div className={styles.countName}>Issued</div>
          <div className={styles.countInfo}>
            <div className={`${styles.countColour} ${styles.Issued}`}></div>
            <div className={styles.count}>34</div>
          </div>
        </div>
        <div className={styles.counterCard}>
          <div className={styles.countName}>Declined</div>
          <div className={styles.countInfo}>
            <div className={`${styles.countColour} ${styles.Declined}`}></div>
            <div className={styles.count}>74</div>
          </div>
        </div>
      </div>
      <div className={styles.policyList}>
        <div className={styles.policyCard}>
          <div className={styles.policyInfo}>
            <div className={styles.policyName}>Humana HMO 2343</div>
            <div className={styles.policyId}>Policy ID: 252456</div>
            <div className={styles.policyCarrier}>Carrier: Humana</div>
          </div>
          <div className={styles.policyHolder}>
            <div className={styles.title}>Policy Holder</div>
            <div className={styles.name}>Anne Polsen</div>
          </div>
          <div className={styles.policyStatus}>Started</div>
          <div className={styles.viewButton}>View Contact</div>
        </div>
        <div className={styles.policyCard}>
          <div className={styles.policyInfo}>
            <div className={styles.policyName}>Humana HMO 2343</div>
            <div className={styles.policyId}>Policy ID: 252456</div>
            <div className={styles.policyCarrier}>Carrier: Humana</div>
          </div>
          <div className={styles.policyHolder}>
            <div className={styles.title}>Policy Holder</div>
            <div className={styles.name}>Anne Polsen</div>
          </div>
          <div className={styles.policyStatus}>Started</div>
          <div className={styles.viewButton}>View Contact</div>
        </div>
      </div>
      <div className={styles.listFooter}>Jump to List</div>
    </div>
  );
}
