import React, { useState, forwardRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Media from "react-media";

// Custom Hooks
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";

// Constants
import FREQUENCY_OPTIONS from "utils/frequencyOptions";

// Utils
import { formatPhoneNumber } from "utils/phones";

// UI Components
import CellData from "components/ui/DetailsTable/CellData";
import DetailsCard from "components/ui/DetailsCard";
import ProviderModal from "components/SharedModals/ProviderModal";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import DeleteLeadModal from "./DeleteLeadModal";
// Local Components
import ContactDetails from "./ContactDetails";
import EditForm from "./DetailsEdit";
import RenderProviders from "components/ui/ProvidersList";
import DetailsMobile from "mobile/Contact/Details/ContactDetails";
import PharmacyModal from "components/SharedModals/PharmacyModal";
// Styles
import "./details.scss";
import "./contactRecordInfo.scss";

const DetailsComponent = forwardRef((props, ref) => {
    const { personalInfo, id, isEdit, detailsRef, providersRef, prescriptionRef, pharmacyRef } = props;
    const { firstName = "", middleName = "", lastName = "" } = personalInfo ?? {};

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPrescription, setIsOpenPrescription] = useState(false);
    const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
    const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
    const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);
    const [deleteModalStatus, setDeleteModalStatus] = useState(false);
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
        deletePrescription,
        deletePharmacy,
        fetchPrescriptions,
        fetchPharmacies,
        fetchProviders,
    } = useHealth();

    useEffect(() => {
        if (id) {
            fetchHealthDetails();
        }
    }, [id]);

    const fetchHealthDetails = useCallback(async () => {
        await Promise.all([fetchPrescriptions(id), fetchPharmacies(id), fetchProviders(id)]);
    }, [id, fetchPrescriptions, fetchPharmacies, fetchProviders]);

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

    const DetailsInfo = () => {
        if (isMobile) {
            return <DetailsMobile {...props} />;
        } else {
            if (isEdit) {
                return <EditForm {...props} />;
            } else {
                return <ContactDetails {...props} />;
            }
        }
    };

    const handleEditProvider = (provider) => {
        setIsOpen(true);
        setProviderEditFlag(true);
        setProviderToEdit(provider);
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className="contactdetailscard" ref={detailsRef}>
                {DetailsInfo()}
            </div>

            <div className="detailscard-container">
                {isOpen && (
                    <ProviderModal
                        open={isOpen}
                        onClose={() => {
                            setIsOpen(false);
                            setProviderEditFlag(false);
                            setProviderToEdit({});
                        }}
                        userZipCode={props?.personalInfo?.addresses?.[0]?.postalCode}
                        leadId={id}
                        selected={providerToEdit}
                        isEdit={providerEditFlag}
                    />
                )}

                {isOpenPrescription && (
                    <PrescriptionModal
                        open={isOpenPrescription}
                        onClose={() => onCloseNewPrescription(false)}
                        leadId={id}
                    />
                )}

                {isOpenEditPrescription && (
                    <PrescriptionModal
                        open={isOpenEditPrescription}
                        onClose={() => onCloseEditPrescription(false)}
                        item={prescriptionToEdit}
                        isEdit={true}
                        leadId={id}
                    />
                )}

                {isOpenPharmacy && (
                    <PharmacyModal
                        open={isOpenPharmacy}
                        onClose={onCloseNewPharmacy}
                        leadId={id}
                        userZipCode={leadDetails?.addresses?.[0]?.postalCode}
                    />
                )}
                <div ref={providersRef}>
                    <DetailsCard
                        dataGtm="section-provider"
                        headerTitle="Providers"
                        onAddClick={onAddNewProvider}
                        items={providers || []}
                        provider={true}
                        isLoading={providerLoading}
                        itemRender={(item) => {
                            return (
                                <div key={item?.NPI} className="provider-container">
                                    <RenderProviders
                                        provider={item}
                                        handleEditProvider={handleEditProvider}
                                        isMobile={isMobile}
                                    />
                                </div>
                            );
                        }}
                    />
                </div>
                <div ref={prescriptionRef}>
                    <DetailsCard
                        dataGtm="section-prescription"
                        headerTitle="Prescriptions"
                        onAddClick={onAddNewPrescription}
                        items={prescriptions}
                        Row={PrescriptionRow}
                        onDelete={deletePrescription}
                        onEdit={onEditPrescription}
                        isLoading={prescriptionLoading}
                    />
                </div>
                <div ref={pharmacyRef}>
                    <DetailsCard
                        dataGtm="section-pharmacies"
                        headerTitle="Pharmacies"
                        onAddClick={onAddNewPharmacy}
                        items={pharmacies}
                        Row={PharamaciesRow}
                        onDelete={deletePharmacy}
                        isLoading={pharmacyLoading}
                    />
                </div>
                <div className="deletecontactsection">
                    <button
                        className="del-btn"
                        data-gtm="buttonn-delete-contact"
                        onClick={() => setDeleteModalStatus(true)}
                    >
                        Delete Contact
                    </button>
                </div>
                {deleteModalStatus && (
                    <DeleteLeadModal
                        leadsId={props?.id}
                        leadName={`${firstName} ${middleName || ""} ${lastName}`}
                        setDeleteModalStatus={() => setDeleteModalStatus(false)}
                        deleteModalStatus={deleteModalStatus}
                    />
                )}
            </div>
        </>
    );
});

DetailsComponent.propTypes = {
    personalInfo: PropTypes.object,
    id: PropTypes.string,
    isEdit: PropTypes.bool,
    detailsRef: PropTypes.object,
    providersRef: PropTypes.object,
    prescriptionRef: PropTypes.object,
    pharmacyRef: PropTypes.object,
};

export default DetailsComponent;
