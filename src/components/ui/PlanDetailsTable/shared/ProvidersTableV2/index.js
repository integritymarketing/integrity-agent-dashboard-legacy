import React from "react";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Edit from "components/Edit";
import styles from "./ProvidersTableV2.module.scss";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

function ProvidersTableV2({ isMobile, providers }) {
  return (
    <PlanDetailsContactSectionCard
      title="Providers"
      isDashboard={true}
      preferencesKey={"providers_collapse"}
      actions={<Edit />}
    >
      <div className={styles.container}>
        {providers.map((provider, index) => {
          const {
            subspecialty,
            firstName,
            middleName,
            lastName,
            address,
            inNetwork,
          } = provider;
          const {
            phoneNumbers,
            streetLine1,
            streetLine2,
            city,
            state,
            zipCode,
          } = address;
          const name = `${firstName || ""} ${middleName || ""} ${
            lastName || ""
          }`;
          const addressDetail = `${streetLine1 || ""} ${streetLine2 || ""} ${
            city || ""
          } ${state || ""} ${zipCode || ""}`;

          return (
            <div key={index} className={styles.row}>
              <div className={styles.rowLeft}>
                <div className={styles.title1}>{subspecialty}</div>
                <div className={styles.title2}>{name}</div>
                <div className={styles.title3}>{phoneNumbers.join(", ")}</div>
              </div>
              <div className={styles.rowMiddle}>
                {inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}
                <div className={styles.address}>{addressDetail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </PlanDetailsContactSectionCard>
  );
}

export default ProvidersTableV2;
