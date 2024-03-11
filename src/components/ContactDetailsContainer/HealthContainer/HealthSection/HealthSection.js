import { useCallback, useEffect, useState } from "react";
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

import useAnalytics from "hooks/useAnalytics";

import FinalExpenseHealthTableSection from "components/FinalExpenseHealthConditionsContainer/FinalExpenseHealthTableSection";
import Modal from "components/Modal";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import ProviderModal from "components/SharedModals/ProviderModal";
import DetailsCard from "components/ui/DetailsCard";
// UI Components
import CellData from "components/ui/DetailsTable/CellData";
import EditPharmacy from "components/ui/PlanDetailsTable/shared/PharmacyTable/components/UpdateView/updateView";
import RenderProviders from "components/ui/ProvidersList";

// Local Components
import PharmacyModal from "components/SharedModals/PharmacyModal";

// Styles
import styles from "./HealthSection.module.scss";

const HealthDetailsSection = () => {
    const { leadId } = useParams();
    const { leadDetails } = useLeadDetails();
    const { fireEvent } = useAnalytics();

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPrescription, setIsOpenPrescription] = useState(false);
    const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
    const [isOpenEditPharmacy, setIsOpenEditPharmacy] = useState(false);
    const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
    const [pharmacyToEdit, setPharmacyToEdit] = useState(null);
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

    useEffect(() => {
        fireEvent("Contact Health Profile Page Viewed", {
            leadid: leadId,
            plan_enroll_profile_created: leadDetails?.plan_enroll_profile_created,
            tags: leadDetails?.leadTags,
            stage: leadDetails?.statusName,
        });
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
    const onEditPharmacy = (item) => {
        setIsOpenEditPharmacy(true);
        setPharmacyToEdit(item);
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
                <CellData header={labelName} subText={drugType} style={styles.width50} />
                <CellData subText={selectPackageDetails} isMobile={isMobile} style={styles.width35} />
            </div>
        );
    };

    const PharamaciesRow = ({ item, className }) => {
        const address = `${item.address1} ${item.address2 ?? ""}, ${item.city},
    ${item.state}, ${item.zip}`;
        const phone = formatPhoneNumber(item.pharmacyPhone);
        return (
            <div className={className}>
                <CellData header={item.name} secondarySubText={phone} useFor="pharmacy" />
                <CellData subText={address} useFor="pharmacy" />
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
                    onAddClick={pharmacies?.length > 0 ? null : onAddNewPharmacy}
                    items={pharmacies}
                    Row={PharamaciesRow}
                    onEdit={onEditPharmacy}
                    isLoading={pharmacyLoading}
                />
                <FinalExpenseHealthTableSection contactId={leadId} isHealthPage={true} />
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
                    <PrescriptionModal
                        open={isOpenPrescription}
                        onClose={() => onCloseNewPrescription(false)}
                        leadId={leadId}
                    />
                )}

                {isOpenEditPrescription && (
                    <PrescriptionModal
                        open={isOpenEditPrescription}
                        onClose={() => onCloseEditPrescription(false)}
                        item={prescriptionToEdit}
                        isEdit={true}
                        leadId={leadId}
                    />
                )}

                {isOpenEditPharmacy && (
                    <Modal
                        open={isOpenEditPharmacy}
                        onClose={() => {
                            setIsOpenEditPharmacy(false);
                        }}
                        hideFooter
                        title={"Update Pharmacy"}
                        isDelete={true}
                        modalName={"Pharmacy"}
                        onDelete={() => {
                            onDeletePharmacy(pharmacyToEdit);
                            setIsOpenEditPharmacy(false);
                        }}
                    >
                        <EditPharmacy data={pharmacyToEdit} />
                    </Modal>
                )}

                {isOpenPharmacy && (
                    <PharmacyModal
                        open={isOpenPharmacy}
                        onClose={onCloseNewPharmacy}
                        leadId={leadId}
                        userZipCode={leadDetails?.addresses?.[0]?.postalCode}
                    />
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