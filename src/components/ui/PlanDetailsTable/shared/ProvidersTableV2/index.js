import React, { useState } from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import styles from "./ProvidersTableV2.module.scss";
import { useParams } from "react-router-dom";
import IconButton from "components/IconButton";
import EditIcon from "components/icons/icon-edit";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import ProviderModal from "components/SharedModals/ProviderModal";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";
import RenderProviders from "components/ui/ProvidersList";

const ProvidersTableV2 = ({ isMobile, providers, refresh }) => {
  const { clientsService } = useClientServiceContext();

  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);
  const addToast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [providerEditFlag, setProviderEditFlag] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState({});

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
            return (
              <div
                className={styles.providerContainer}
                key={`Provider-plansPage-${index}`}
              >
                <RenderProviders
                  item={provider}
                  setIsOpen={setIsOpen}
                  setProviderEditFlag={setProviderEditFlag}
                  setProviderToEdit={setProviderToEdit}
                  isPlanPage={true}
                />
              </div>
            );
          })}
        </div>
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
            selected={providerToEdit}
            isEdit={providerEditFlag}
          />
        )}
      </PlanDetailsContactSectionCard>
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
