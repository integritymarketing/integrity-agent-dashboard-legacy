import React, { useState } from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import styles from "./ProvidersTableV2.module.scss";
import { useParams } from "react-router-dom";
// import IconButton from "components/IconButton";
// import EditIcon from "components/icons/icon-edit";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import ProviderModal from "components/SharedModals/ProviderModal";
import RenderProviders from "components/ui/ProvidersList";
import useLeadInformation from "hooks/useLeadInformation";
// import Plus from "components/icons/plus";

const ProvidersTableV2 = ({ isMobile, providers, refresh }) => {
  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);
  const { addProvider, deleteProvider } = useLeadInformation(contactId);

  const [isOpen, setIsOpen] = useState(false);
  const [providerEditFlag, setProviderEditFlag] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState({});

  const onAddNewProvider = () => setIsOpen(true);

  const isEdit = providers?.length > 0 ? true : false;

  return (
    <>
      <PlanDetailsContactSectionCard
        title="Providers"
        isDashboard={true}
        preferencesKey="providers_collapse"
        // actions={
        //   <IconButton
        //     label={isEdit ? "Edit" : "Add"}
        //     onClick={onAddNewProvider}
        //     icon={isEdit ? <EditIcon /> : <Plus />}
        //   />
        // }
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
