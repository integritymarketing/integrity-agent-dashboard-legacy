import React, { useState } from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Plus from "components/icons/plus";
import { useParams } from "react-router-dom";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import ProviderModal from "components/SharedModals/ProviderModal";
import RenderProviders from "components/ui/ProvidersList";
import ProviderCoverageModal from "components/SharedModals/ProviderCoverageModal";
import Edit from "components/Edit";
import EditIcon from "components/icons/edit2";

import styles from "./ProvidersTableV2.module.scss";

const ProvidersTableV2 = ({ isMobile, providers, refresh, planName }) => {
  const { contactId } = useParams();
  const { leadDetails } = useContactDetails(contactId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState(null);

  const [coverageModal, setCoverageModal] = useState(false);

  const isEdit = providers?.length > 0 ? true : false;

  const closeAllModalsAndRefresh = () => {
    setIsModalOpen(false);
    setIsEditingProvider(false);
    setProviderToEdit(null);
    if (refresh) refresh();
  };

  const handleAddEditProvider = () => {
    if (isEdit) {
      setCoverageModal(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleEditProvider = (provider) => {
    setCoverageModal(false);
    setIsModalOpen(true);
    setIsEditingProvider(true);
    setProviderToEdit(provider);
  };

  const selectedProvider = isEditingProvider
    ? { ...providerToEdit, NPI: providerToEdit?.npi }
    : null;
  return (
    <>
      <PlanDetailsContactSectionCard
        title="Providers"
        isDashboard
        preferencesKey="providers_collapse"
        actions={
          <Edit
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
            onClose={() => setIsModalOpen(false)}
            userZipCode={leadDetails?.addresses?.[0]?.postalCode}
            selected={selectedProvider}
            isEdit={isEditingProvider}
            refresh={closeAllModalsAndRefresh}
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
            onEditProvider={handleEditProvider}
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
