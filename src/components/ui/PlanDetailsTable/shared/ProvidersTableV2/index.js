import React from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Edit from "components/Edit";
import styles from "./ProvidersTableV2.module.scss";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

const ProvidersTableV2 = ({ isMobile, providers }) => {
  function formatPhoneNumber(phoneNumber) {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return null;
  }

  return (
    <PlanDetailsContactSectionCard
      title="Providers"
      isDashboard={true}
      preferencesKey="providers_collapse"
      {...(providers?.length && { actions: <Edit /> })}
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
          const addressDetail1 = [streetLine1, streetLine2]
            .filter(Boolean)
            .join(" ");
          const addressDetail2 = [city, state, zipCode]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={index}
              className={isMobile ? styles.rowMobile : styles.row}
            >
              <div className={styles.rowLeft}>
                <div className={styles.subspecialty}>{subspecialty}</div>
                <div className={styles.name}>{fullName}</div>
                <div className={styles.phoneNumbers}>
                  {phoneNumbers
                    .map((phn) => formatPhoneNumber(phn))
                    ?.join(", ")}
                </div>
              </div>
              {isMobile ? (
                <div className={styles.label}>Selected Location</div>
              ) : null}
              <div className={styles.rowMiddle}>
                {inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}
                {isMobile ? (
                  <div className={styles.addresses}>
                    <div className={styles.address}>{addressDetail1}</div>
                    <div className={styles.address}>{addressDetail2}</div>
                  </div>
                ) : (
                  <div
                    className={styles.address}
                  >{`${addressDetail1} ${addressDetail2}`}</div>
                )}
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
