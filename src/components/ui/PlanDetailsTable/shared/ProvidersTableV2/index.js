import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import IconButton from "components/IconButton";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import EditIcon from "components/icons/icon-edit";
import Plus from "components/icons/plus";
import { useParams } from "react-router-dom";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import ProviderModal from "components/SharedModals/ProviderModal";
import RenderProviders from "components/ui/ProvidersList";
import styles from "./ProvidersTableV2.module.scss";

const ProvidersTableV2 = ({ isMobile, providers, refresh }) => {
  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState(null);

  const handleAddNewProvider = () => setIsModalOpen(true);

  const shouldShowEditIcon = useMemo(
    () => Boolean(providers?.length),
    [providers]
  );

  const closeAllModalsAndRefresh = () => {
    setIsModalOpen(false);
    setIsEditingProvider(false);
    setProviderToEdit(null);
    refresh();
  };

  return (
    <>
      <PlanDetailsContactSectionCard
        title="Providers"
        isDashboard
        preferencesKey="providers_collapse"
        actions={
          <IconButton
            label={shouldShowEditIcon ? "Edit" : "Add"}
            onClick={handleAddNewProvider}
            icon={shouldShowEditIcon ? <EditIcon /> : <Plus />}
          />
        }
      >
        <div className={styles.container}>
          {providers?.map((provider, index) => (
            <div
              className={styles.providerContainer}
              key={`Provider-plansPage-${index}`}
            >
              <RenderProviders
                key={`provider-${index}`}
                provider={provider}
                setIsModalOpen={setIsModalOpen}
                setIsEditingProvider={setIsEditingProvider}
                setProviderToEdit={setProviderToEdit}
                isPlanPage
              />
            </div>
          ))}
        </div>
        {isModalOpen && (
          <ProviderModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setIsEditingProvider(false);
              setProviderToEdit(null);
            }}
            userZipCode={leadDetails?.addresses?.[0]?.postalCode}
            contactId={contactId}
            existingProviders={providers}
            selectedProvider={providerToEdit}
            isEditing={isEditingProvider}
            refresh={closeAllModalsAndRefresh}
          />
        )}
      </PlanDetailsContactSectionCard>
    </>
  );
};

ProvidersTableV2.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  providers: PropTypes.arrayOf(PropTypes.object).isRequired,
  refresh: PropTypes.func.isRequired,
};

export default ProvidersTableV2;
