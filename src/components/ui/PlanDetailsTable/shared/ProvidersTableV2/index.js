import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "components/IconButton";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import EditIcon from "components/icons/icon-edit";
import Plus from "components/icons/plus";
import { useParams } from "react-router-dom";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import ProviderModal from "components/SharedModals/ProviderModal";
import RenderProviders from "components/ui/ProvidersList";
import ProviderCoverageModal from "components/SharedModals/ProviderCoverageModal";
import styles from "./ProvidersTableV2.module.scss";

const ProvidersTableV2 = ({ isMobile, providers, refresh, planName }) => {
  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState(null);

  const [coverageModal, setCoverageModal] = useState(false);

  const isEdit = providers?.length > 0 ? true : false;

  const closeAllModalsAndRefresh = (isRefresh) => {
    setIsModalOpen(false);
    setIsEditingProvider(false);
    setProviderToEdit(null);
    isRefresh && refresh();
  };

  const handleAddEditProvider = () => {
    if (isEdit) {
      setCoverageModal(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleEditProvider = (provider) => {
    setIsModalOpen(true);
    setIsEditingProvider(true);
    setProviderToEdit(provider);
  };

  return (
    <>
      <PlanDetailsContactSectionCard
        title="Providers"
        isDashboard
        preferencesKey="providers_collapse"
        actions={
          <IconButton
            label={isEdit ? "Edit" : "Add"}
            onClick={handleAddEditProvider}
            icon={isEdit ? <EditIcon /> : <Plus />}
          />
        }
      >
        <div className={styles.container}>
          {providers?.map((provider) => (
            <div className={styles.providerContainer} key={provider?.NPI}>
              <RenderProviders
                provider={provider}
                handleEditProvider={handleEditProvider}
                isPlanPage
              />
            </div>
          ))}
        </div>
        {isModalOpen && (
          <ProviderModal
            open={isModalOpen}
            onClose={closeAllModalsAndRefresh}
            userZipCode={leadDetails?.addresses?.[0]?.postalCode}
            selected={providerToEdit}
            isEdit={isEditingProvider}
            refresh={() => closeAllModalsAndRefresh(true)}
          />
        )}

        {coverageModal && (
          <ProviderCoverageModal
            open={coverageModal}
            onClose={() => setCoverageModal(false)}
            providers={providers}
            planName={planName}
            addNew={() => {
              setCoverageModal(false);
              setIsModalOpen(true);
            }}
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
