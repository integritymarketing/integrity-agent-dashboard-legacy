import React from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Edit from "components/Edit";
import styles from "./ProvidersTableV2.module.scss";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

const ProvidersTableV2 = ({ isMobile, providers }) => {
  return (
    <PlanDetailsContactSectionCard
      title="Providers"
      isDashboard={true}
      preferencesKey="providers_collapse"
      actions={<Edit />}
    >
      <div className={styles.container}>
        {providers?.map((provider, index) => {
          const {
            subspecialty,
            firstName,
            middleName,
            lastName,
            address,
            inNetwork,
          } = provider;
          const {
            phoneNumbers, // Extract phoneNumbers from address
            streetLine1,
            streetLine2,
            city,
            state,
            zipCode,
          } = address;
          const fullName = [firstName, middleName, lastName]
            .filter(Boolean)
            .join(" ");
          const fullAddress = [streetLine1, streetLine2, city, state, zipCode]
            .filter(Boolean)
            .join(", ");

          return (
            <div key={index} className={styles.row}>
              <div className={styles.rowLeft}>
                <div className={styles.subspecialty}>{subspecialty}</div>
                <div className={styles.name}>{fullName}</div>
                <div className={styles.phoneNumbers}>
                  {phoneNumbers?.join(", ")} {/* Added null check */}
                </div>
              </div>
              <div className={styles.rowMiddle}>
                {inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}
                <div className={styles.address}>{fullAddress}</div>
              </div>
            </div>
          );
        })}
      </div>
    </PlanDetailsContactSectionCard>
  );
};

ProvidersTableV2.propTypes = {
  isMobile: PropTypes.bool,
  providers: PropTypes.arrayOf(
    PropTypes.shape({
      subspecialty: PropTypes.string,
      firstName: PropTypes.string,
      middleName: PropTypes.string,
      lastName: PropTypes.string,
      address: PropTypes.shape({
        phoneNumbers: PropTypes.arrayOf(PropTypes.string),
        streetLine1: PropTypes.string,
        streetLine2: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zipCode: PropTypes.string,
      }),
      inNetwork: PropTypes.bool,
    })
  ),
};

export default ProvidersTableV2;
