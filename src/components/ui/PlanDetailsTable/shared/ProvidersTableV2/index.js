import React, { useState } from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import styles from "./ProvidersTableV2.module.scss";
import { useParams } from "react-router-dom";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import ProviderModal from "components/SharedModals/ProviderModal";
import RenderProviders from "components/ui/ProvidersList";

const ProvidersTableV2 = ({
  isMobile,
  providers,
  refresh,
  addProvider,
  deleteProvider,
}) => {
  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);
  const [isOpen, setIsOpen] = useState(false);
  const [providerEditFlag, setProviderEditFlag] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState({});

  return (
    <>
      <PlanDetailsContactSectionCard
        title="Providers"
        isDashboard={true}
        preferencesKey="providers_collapse"
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
              setProviderEditFlag(false);
              setProviderToEdit({});
              setIsOpen(false);
            }}
            onSave={addProvider}
            userZipCode={leadDetails?.addresses[0]?.postalCode}
            leadId={contactId}
            onDelete={deleteProvider}
            leadProviders={providers}
            selected={providerToEdit}
            isEdit={providerEditFlag}
            refresh={refresh}
          />
        )}
      </PlanDetailsContactSectionCard>
    </>
  );
};

ProvidersTableV2.propTypes = {
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
