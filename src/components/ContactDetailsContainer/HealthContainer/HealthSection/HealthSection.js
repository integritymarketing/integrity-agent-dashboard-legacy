import { useCallback, useEffect, useMemo, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";
// Custom Hooks
import { useLeadDetails } from "providers/ContactDetails";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";

// Constants
import FREQUENCY_OPTIONS from "utils/frequencyOptions";

import useAnalytics from "hooks/useAnalytics";

import FinalExpenseHealthTableSection from "components/FinalExpenseHealthConditionsContainer/FinalExpenseHealthTableSection";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import ProviderModal from "components/SharedModals/ProviderModal";
import DetailsCard from "components/ui/DetailsCard";
// UI Components
import CellData from "components/ui/DetailsTable/CellData";
import RenderProviders from "components/ui/ProvidersList";

// Local Components
import PharmacyModal from "components/SharedModals/PharmacyModal";

import { PharmacyItem } from "./PharmacyItem";

// Styles
import styles from "./HealthSection.module.scss";

const HealthDetailsSection = () => {
    const { leadId } = useParams();
    const { leadDetails } = useLeadDetails();
    const { fireEvent } = useAnalytics();

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
        putLeadPharmacy,
    } = useHealth();

    useEffect(() => {
        if (leadId) {
            fetchHealthDetails();
        }
    }, [leadId]);

    const modifiedPharmacies = useMemo(() => {
        if (pharmacies?.length) {
            const primaryPharmacy = pharmacies.find((item) => item.isPrimary === true);
            if (!primaryPharmacy) {
                const firstPharmacy = { ...pharmacies[0], isPrimary: true };
                return [firstPharmacy, ...pharmacies.slice(1)];
            } else {
                return pharmacies;
            }
        }
        return [];
    }, [pharmacies]);


    const sortedPharmaciesData = useMemo(() => {
        return [...modifiedPharmacies].sort((a, b) => b.isPrimary - a.isPrimary);
    }, [modifiedPharmacies]);


    const handleSetAsPrimary = async (pharmacyId) => {
        const pharmacyItem = { ...pharmacies.find((item) => item.pharmacyId === pharmacyId), isPrimary: true };
        await putLeadPharmacy(leadId, pharmacyItem);
        fetchPharmacies(leadId);
    };

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

    const handleEditProvider = (provider) => {
        setIsOpen(true);
        setProviderEditFlag(true);
        setProviderToEdit(provider);
    };

    const onDeletePharmacy = async (pharmacy) => {
        await deletePharmacy(pharmacy, null, leadId);
        if (pharmacy.isPrimary) {
            const pharmacyToMakePrimary = pharmacies.find((item) => {
                if (item.pharmacyId !== pharmacy.pharmacyId) {
                    return true;
                }
            });
            if (pharmacyToMakePrimary) {
                handleSetAsPrimary(pharmacyToMakePrimary.pharmacyId);
            }
        }
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
                    onAddClick={pharmacies?.length > 3 ? null : onAddNewPharmacy}
                    disabled={pharmacies?.length >= 3}
                    items={sortedPharmaciesData}
                    provider={true}
                    isLoading={pharmacyLoading}
                    itemRender={(item) => {
                        return (
                            <div key={item?.pharmacyRecordID} className={styles.providerContainer}>
                                <PharmacyItem
                                    pharmacy={item}
                                    handleSetAsPrimary={handleSetAsPrimary}
                                    onDeletePharmacy={onDeletePharmacy}
                                />
                            </div>
                        );
                    }}
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

                {isOpenPharmacy && (
                    <PharmacyModal
                        open={isOpenPharmacy}
                        pharmaciesPreSelected={pharmacies}
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
    leadDetails: PropTypes.object.isRequired,
    leadId: PropTypes.string.isRequired,
    pharmacies: PropTypes.arrayOf(
        PropTypes.shape({
            pharmacyRecordID: PropTypes.string,
        })
    ),
    providers: PropTypes.arrayOf(
        PropTypes.shape({
            NPI: PropTypes.string,
        })
    ),
    prescriptions: PropTypes.arrayOf(
        PropTypes.shape({
            dosage: PropTypes.shape({
                labelName: PropTypes.string.isRequired,
                daysOfSupply: PropTypes.number.isRequired,
                drugType: PropTypes.string.isRequired,
                selectedPackage: PropTypes.object,
                userQuantity: PropTypes.number.isRequired,
            }),
            dosageDetails: PropTypes.shape({
                dosageFormName: PropTypes.string,
            }),
        })
    ),
    prescriptionToEdit: PropTypes.array,
    providerEditFlag: PropTypes.bool,
    providerToEdit: PropTypes.object,
    pharmacyLoading: PropTypes.bool,
    providerLoading: PropTypes.bool,
    prescriptionLoading: PropTypes.bool,
    isMobile: PropTypes.bool,
    isOpen: PropTypes.bool,
    isOpenPrescription: PropTypes.bool,
    isOpenEditPrescription: PropTypes.bool,
    isOpenPharmacy: PropTypes.bool,
    item: PropTypes.shape({
        dosage: PropTypes.shape({
            labelName: PropTypes.string.isRequired,
            daysOfSupply: PropTypes.number.isRequired,
            drugType: PropTypes.string.isRequired,
            selectedPackage: PropTypes.shape({
                packageDisplayText: PropTypes.string,
            }),
            userQuantity: PropTypes.number.isRequired,
        }).isRequired,
        dosageDetails: PropTypes.shape({
            dosageFormName: PropTypes.string,
        }),
    }).isRequired,
    className: PropTypes.string,
};

export default HealthDetailsSection;
