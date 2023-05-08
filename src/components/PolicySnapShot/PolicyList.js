import React from "react";
import styles from "./styles.module.scss";

const mockData = [
  {
    policyName: "Humana HMO 2343",
    policyId: "252456",
    policyCarrier: "Humana",
    policyHolder: "Anne Polsen",
    policyStatus: "Started",
  },
  {
    policyName: "Humana HMO 2343",
    policyId: "252456",
    policyCarrier: "Humana",
    policyHolder: "Anne Polsen",
    policyStatus: "Started",
  },
];

export default function PolicyList() {
  return (
    <>
      <div className={styles.policyList}>
        {mockData?.map((policy, i) => {
          return (
            <div className={styles.policyCard}>
              <div className={styles.policyInfo}>
                <div className={styles.policyName}>{policy.policyName}</div>
                <div className={styles.policyId}>
                  Policy ID: {policy.policyId}
                </div>
                <div className={styles.policyCarrier}>
                  Carrier: {policy.policyCarrier}
                </div>
              </div>
              <div className={styles.policyHolder}>
                <div className={styles.title}>Policy Holder</div>
                <div className={styles.name}>{policy.policyHolder}</div>
              </div>
              <div className={styles.policyStatus}>{policy.policyStatus}</div>
              <div className={styles.viewButton}>View Contact</div>
            </div>
          );
        })}
      </div>
      <div className={styles.listFooter}>Jump to List</div>
    </>
  );
}
