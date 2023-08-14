import React, { useState } from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import styles from "./ProvidersTableV2.module.scss";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";
import { useParams } from "react-router-dom";
import IconButton from "components/IconButton";
import EditIcon from "components/icons/icon-edit";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import ProviderModal from "components/SharedModals/ProviderModal";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";

const ProvidersTableV2 = ({ isMobile, providers, refresh }) => {
  const { clientsService } = useClientServiceContext();

  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);
  const addToast = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const onAddNewProvider = () => setIsOpen(true);

  const addProvider = async (addressId, leadId, npi, providerName) => {
    const request = [
      {
        npi: npi?.toString(),
        addressId: addressId,
        isPrimary: false,
      },
    ];
    try {
      await clientsService.createLeadProvider(leadId, request);
      await refresh();
      addToast({
        message: providerName + " added to the list. ",
        time: 10000,
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to add Provider",
      });
    }
  };

  function formatPhoneNumber(phoneNumber) {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return null;
  }

  const isEdit = providers?.length > 0 ? true : false;

  return (
    <>
      <PlanDetailsContactSectionCard
        title="Providers"
        isDashboard={true}
        preferencesKey="providers_collapse"
        actions={
          <IconButton
            label={isEdit ? "Edit" : "Add"}
            onClick={onAddNewProvider}
            icon={isEdit ? <EditIcon /> : null}
          />
        }
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
              phoneNumbers,
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
                      ?.map((phn) => formatPhoneNumber(phn))
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
      {isOpen && (
        <ProviderModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          onSave={addProvider}
          userZipCode={leadDetails?.addresses[0]?.postalCode}
          leadId={contactId}
          leadProviders={providers}
        />
      )}
    </>
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
