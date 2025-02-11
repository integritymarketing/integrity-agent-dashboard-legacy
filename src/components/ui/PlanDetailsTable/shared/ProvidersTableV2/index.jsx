import React, { useState } from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Plus from "components/icons/plus";
import { useParams } from "react-router-dom";
import ProviderModal from "components/SharedModals/ProviderModal";
import RenderProviders from "components/ui/ProvidersList";
import ProviderCoverageModal from "components/SharedModals/ProviderCoverageModal";
import Edit from "components/Edit";
import EditIcon from "components/icons/edit2";
import { removeDuplicates } from "utils/shared-utils/sharedUtility";

import styles from "./ProvidersTableV2.module.scss";

const ProvidersTableV2 = ({ isMobile, providers, refresh, planName, isEnroll, contact }) => {
    const { contactId } = useParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingProvider, setIsEditingProvider] = useState(false);
    const [providerToEdit, setProviderToEdit] = useState(null);

    const [coverageModal, setCoverageModal] = useState(false);
    const uniqueProvidersList = removeDuplicates(providers, "npi");

    const isEdit = uniqueProvidersList?.length > 0 ? true : false;

    const closeAllModalsAndRefresh = () => {
        setIsModalOpen(false);
        setIsEditingProvider(false);
        setProviderToEdit(null);
        if (refresh) {refresh();}
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setIsEditingProvider(false);
        setProviderToEdit(null);
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

    const selectedProvider = isEditingProvider ? { ...providerToEdit, NPI: providerToEdit?.npi } : null;
    return (
        <>
            <PlanDetailsContactSectionCard
                title="Providers"
                isDashboard
                preferencesKey="providers_collapse"
                actions={
                    !isEnroll ? (
                        <Edit
                            label={isEdit ? "Edit" : "Add"}
                            onClick={handleAddEditProvider}
                            icon={isEdit ? <EditIcon /> : <Plus />}
                        />
                    ) : (
                        ""
                    )
                }
            >
                <div className={styles.container}>
                    {uniqueProvidersList?.map((provider) => (
                        <div className={styles.providerContainer} key={provider?.NPI}>
                            <RenderProviders
                                provider={provider}
                                handleEditProvider={!isEnroll ? handleEditProvider : null}
                                isPlanPage
                                isMobile={isMobile}
                            />
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <ProviderModal
                        open={isModalOpen}
                        onClose={closeEditModal}
                        userZipCode={contact?.addresses?.[0]?.postalCode}
                        selected={selectedProvider}
                        isEdit={isEditingProvider}
                        refresh={closeAllModalsAndRefresh}
                        leadId={contactId}
                    />
                )}

                {coverageModal && (
                    <ProviderCoverageModal
                        open={coverageModal}
                        onClose={() => setCoverageModal(false)}
                        providers={uniqueProvidersList}
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
