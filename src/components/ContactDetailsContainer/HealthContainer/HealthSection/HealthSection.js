import React, { useCallback, useEffect, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";
// Custom Hooks
import { useLeadDetails } from "providers/ContactDetails";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";

// Constants
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
// Utils
import { formatPhoneNumber } from "utils/phones";

import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import ProviderModal from "components/SharedModals/ProviderModal";
import DetailsCard from "components/ui/DetailsCard";
// UI Components
import CellData from "components/ui/DetailsTable/CellData";
import RenderProviders from "components/ui/ProvidersList";

// Local Components
import AddPharmacy from "pages/contacts/contactRecordInfo/modals/AddPharmacy";

// Styles
import styles from "./HealthSection.module.scss";

const HealthDetailsSection = () => {
    const { leadId } = useParams();
    const { leadDetails } = useLeadDetails();

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPrescription, setIsOpenPrescription] = useState(false);
    const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
    const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
    const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [providerEditFlag, setProviderEditFlag] = useState(false);
    const [providerToEdit, setProviderToEdit] = useState({});

    const {
        pharmacies = [],
        pharmacyLoading,
        providers = [],
        providerLoading,
        prescriptions = [],
        prescriptionLoading,
        deletePharmacy,
        fetchPrescriptions,
        fetchPharmacies,
        fetchProviders,
    } = useHealth();

    useEffect(() => {
        if (leadId) {
            fetchHealthDetails();
        }
    }, [leadId]);

    const fetchHealthDetails = useCallback(async () => {
        await Promise.all([fetchPrescriptions(leadId), fetchPharmacies(leadId), fetchProviders(leadId)]);
    }, [leadId, fetchPrescriptions, fetchPharmacies, fetchProviders]);

    const onAddNewPrescription = () => setIsOpenPrescription(true);
    const onCloseNewPrescription = () => setIsOpenPrescription(false);
    const onEditPrescription = (item) => {
        setIsOpenEditPrescription(true);
        setPrescriptionToEdit(item);
    };
    const onCloseEditPrescription = () => setIsOpenEditPrescription(false);
    const onAddNewPharmacy = () => setIsOpenPharmacy(true);
    const onCloseNewPharmacy = () => setIsOpenPharmacy(false);
    const onAddNewProvider = () => setIsOpen(true);

    const getFrequencyValue = (dayofSupply) => {
        const frequencyOptions = FREQUENCY_OPTIONS.filter((option) => option.value === dayofSupply);
        const result = frequencyOptions[0]?.label;
        return result;
    };

    const PrescriptionRow = ({ item, className }) => {
        const { dosage, dosageDetails } = item;
        const { labelName, daysOfSupply, drugType, selectedPackage, userQuantity } = dosage;
        const selectPackageDetails = selectedPackage
            ? `${userQuantity} X ${selectedPackage.packageDisplayText} ${getFrequencyValue(daysOfSupply)}`
            : dosageDetails
                ? `${userQuantity} ${dosageDetails.dosageFormName.toLowerCase()} ${getFrequencyValue(daysOfSupply)}`
                : "";

        return (
            <div className={className}>
                <CellData header={labelName} subText={drugType} />
                <CellData subText={selectPackageDetails} />
            </div>
        );
    };

    const PharamaciesRow = ({ item, className }) => {
        const address = `${item.address1} ${item.address2 ?? ""}, ${item.city},
    ${item.state}, ${item.zip}`;
        const phone = formatPhoneNumber(item.pharmacyPhone);
        return (
            <div className={className}>
                <CellData header={item.name} subText={address} secondarySubText={phone} useFor="pharmacy" />
            </div>
        );
    };

    const handleEditProvider = (provider) => {
        setIsOpen(true);
        setProviderEditFlag(true);
        setProviderToEdit(provider);
    };

    const onDeletePharmacy = (pharmacy) => {
        deletePharmacy(pharmacy, null, leadId);
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />

            <div className={styles.detailscardContainer}>
                <Box marginTop="-1.2rem">
                    <DetailsCard
                        dataGtm="section-provider"
                        headerTitle="Providers"
                        onAddClick={onAddNewProvider}
                        items={providers || []}
                        provider={true}
                        isLoading={providerLoading}
                        itemRender={(item) => {
                            return (
                                <div key={item?.NPI} className={styles.providerContainer}>
                                    <RenderProviders
                                        provider={item}
                                        handleEditProvider={handleEditProvider}
                                        isMobile={isMobile}
                                    />
                                </div>
                            );
                        }}
                    />
                </Box>
                <DetailsCard
                    dataGtm="section-prescription"
                    headerTitle="Prescriptions"
                    onAddClick={onAddNewPrescription}
                    items={prescriptions}
                    Row={PrescriptionRow}
                    onEdit={onEditPrescription}
                    isLoading={prescriptionLoading}
                />
                <DetailsCard
                    dataGtm="section-pharmacies"
                    headerTitle="Pharmacies"
                    onAddClick={onAddNewPharmacy}
                    items={pharmacies}
                    Row={PharamaciesRow}
                    onDelete={onDeletePharmacy}
                    isLoading={pharmacyLoading}
                />
                {isOpen && (
                    <ProviderModal
                        open={isOpen}
                        onClose={() => {
                            setIsOpen(false);
                            setProviderEditFlag(false);
                            setProviderToEdit({});
                        }}
                        userZipCode={leadDetails?.addresses?.[0]?.postalCode}
                        leadId={leadId}
                        selected={providerToEdit}
                        isEdit={providerEditFlag}
                    />
                )}

                {isOpenPrescription && (
                    <PrescriptionModal open={isOpenPrescription} onClose={() => onCloseNewPrescription(false)} leadId={leadId} />
                )}

                {isOpenEditPrescription && (
                    <PrescriptionModal
                        open={isOpenEditPrescription}
                        onClose={() => onCloseEditPrescription(false)}
                        item={prescriptionToEdit}
                        isEdit={true}
                    />
                )}

                {isOpenPharmacy && (
                    <AddPharmacy isOpen={isOpenPharmacy} onClose={onCloseNewPharmacy} leadDetails={leadDetails} />
                )}
            </div>
        </>
    );
};

HealthDetailsSection.propTypes = {
    leadDetails: PropTypes.object,
    leadId: PropTypes.string,
};

export default HealthDetailsSection;
