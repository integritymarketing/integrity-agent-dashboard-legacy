import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./PlanCoverage.module.scss";
import AddPharmacy from "pages/contacts/contactRecordInfo/modals/AddPharmacy";
import Modal from "components/Modal";
import PharmacySvg from "./assets/pharmacySvg";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import PrescriptionSvg from "./assets/prescriptionSvg";
import ProviderModal from "components/SharedModals/ProviderModal";
import ProviderSvg from "./assets/providerSvg";
import UpdateView from "components/ui/PlanDetailsTable/shared/PharmacyTable/components/UpdateView/updateView";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import ProviderCoverageModal from "components/SharedModals/ProviderCoverageModal";
import PrescriptionCoverageModal from "components/SharedModals/PrescriptionCoverageModal";

const PlanCoverage = ({ contact, planData, planName, refresh, contactId }) => {
  const {
    deletePharmacy,
    prescriptions: prescriptionsList,
    pharmacies: pharmaciesList,
    providers: providersList,
    fetchPrescriptions,
    fetchPharmacies,
    fetchProviders,
  } = useHealth() || {};

  const prescriptions = planData?.planDrugCoverage;

  // Prescription Modal states //
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
  const [isPrescriptionCoverageModalOpen, setIsPrescriptionCoverageModalOpen] =
    useState(false);

  // Provider Modal states //
  const [providerToEdit, setProviderToEdit] = useState(null);

  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);

  const [isProviderCoverageModalOpen, setIsProviderCoverageModalOpen] =
    useState(false);

  // pharmacy modal states //

  const [openAddPharmacyModal, setOpenAddPharmacyModal] = useState(false);
  const [isOpenPharmacyCoverageMOdal, setIsOpenPharmacyCoverageModal] =
    useState(false);



  useEffect(() => {
    if (contactId) {
      fetchHealthDetails();
    }
  }, [contactId]);

  const fetchHealthDetails = useCallback(async () => {
    await Promise.all([
      fetchPrescriptions(contactId),
      fetchPharmacies(contactId),
      fetchProviders(contactId),
    ]);
  }, [contactId, fetchPrescriptions, fetchPharmacies, fetchProviders]);



  // prescription modal handle functions //
  const onAddNewPrescription = () => setIsOpenPrescription(true);
  const onCloseNewPrescription = () => setIsOpenPrescription(false);
  const onEditPrescription = (item) => {
    setIsPrescriptionCoverageModalOpen(false);
    setIsOpenEditPrescription(true);
    setPrescriptionToEdit(item);
  };
  const onCloseEditPrescription = () => setIsOpenEditPrescription(false);
  const handleAddEditPrescrptions = () => {
    if (prescriptionsList?.length > 0) {
      setIsPrescriptionCoverageModalOpen(true);
    } else {
      onAddNewPrescription();
    }
  };

  const closePrescriptionModalsAndRefresh = () => {
    onCloseNewPrescription(false);
    onCloseEditPrescription(false);
    setIsPrescriptionCoverageModalOpen(false);
    refresh();
  };

  // provider modal handle functions //
  const closeProviderModalsAndRefresh = () => {
    setIsProviderModalOpen(false);
    setIsEditingProvider(false);
    setProviderToEdit(null);
    if (refresh) refresh();
  };

  // provider modal handle functions //
  const closeEditProviderModal = () => {
    setIsProviderModalOpen(false);
    setIsEditingProvider(false);
    setProviderToEdit(null);
  };

  const handleAddEditProvider = () => {
    if (providersList?.length > 0) {
      setIsProviderCoverageModalOpen(true);
    } else {
      setIsProviderModalOpen(true);
    }
  };
  const handleEditProvider = (provider) => {
    setIsProviderCoverageModalOpen(false);
    setIsProviderModalOpen(true);
    setIsEditingProvider(true);
    setProviderToEdit(provider);
  };

  // pharmacy modal handle functions //
  const handleAddEditPharmacy = () => {
    if (pharmaciesList?.length > 0) {
      setIsOpenPharmacyCoverageModal(true);
    } else {
      setOpenAddPharmacyModal(true);
    }
  };

  const selectedProvider = isEditingProvider
    ? {
      ...providerToEdit,
      NPI: providerToEdit?.npi,
    }
    : null;

  const totalProvidersLocation = planData?.providers?.reduce(
    (acc, provider) => {
      return acc + provider?.addresses?.length;
    },
    0
  );
  const totalCoveredProvidersLocation = planData?.providers?.reduce(
    (acc, provider) => {
      return (
        acc +
        provider?.addresses?.filter((address) => address?.inNetwork).length
      );
    },
    0
  );

  const coveredPharmacies = planData?.pharmacyCosts?.filter(
    (pharmacy) =>
      pharmaciesList[0]?.pharmacyID === pharmacy?.pharmacyID &&
      pharmacy?.isNetwork
  );

  const coveredPrescriptions = planData?.planDrugCoverage?.filter(
    (prescription) => prescription?.tierNumber > 0
  );

  const coveredPrescriptionsLength = coveredPrescriptions?.length || 0;

  const addPharmacyText =
    pharmaciesList?.length > 0
      ? `${coveredPharmacies?.length} of ${pharmaciesList?.length} Pharmacies Covered`
      : "Add Pharmacy";
  const addPrescriptionText =
    prescriptionsList?.length > 0
      ? `${coveredPrescriptionsLength} of ${prescriptionsList?.length} Prescriptions Covered`
      : "Add Prescriptions";
  const addProviderText =
    providersList?.length > 0
      ? `${totalCoveredProvidersLocation} of ${totalProvidersLocation} Provider Locations Covered`
      : "Add Providers";

  return (
    <div>
      <div className={`${styles.heading}`}>Plan Coverage</div>

      <div className={`${styles.itemsContainer}`}>
        <div className={`${styles.item}`}>
          <PharmacySvg />
          <span onClick={handleAddEditPharmacy}>{addPharmacyText}</span>
        </div>
        <div className={`${styles.item}`}>
          <ProviderSvg />
          <span onClick={handleAddEditProvider}>{addProviderText}</span>
        </div>
        <div className={`${styles.item}`}>
          <PrescriptionSvg />
          <span onClick={handleAddEditPrescrptions}>{addPrescriptionText}</span>
        </div>
      </div>

      {/* Provider Modals  */}
      {isProviderModalOpen && (
        <ProviderModal
          open={isProviderModalOpen}
          onClose={closeEditProviderModal}
          userZipCode={contact?.addresses?.[0]?.postalCode}
          selected={selectedProvider}
          isEdit={isEditingProvider}
          refresh={closeProviderModalsAndRefresh}
          leadId={contactId}
        />
      )}

      {isProviderCoverageModalOpen && (
        <ProviderCoverageModal
          open={isProviderCoverageModalOpen}
          onClose={() => setIsProviderCoverageModalOpen(false)}
          providers={planData?.providers}
          planName={planName}
          addNew={() => {
            setIsProviderCoverageModalOpen(false);
            setIsProviderModalOpen(true);
          }}
          onEditProvider={handleEditProvider}
        />
      )}

      {/* Prescription Modals  */}
      {isOpenPrescription && (
        <PrescriptionModal
          open={isOpenPrescription}
          onClose={() => onCloseNewPrescription(false)}
          prescriptions={prescriptions}
          refresh={closePrescriptionModalsAndRefresh}
          leadId={contactId}
        />
      )}

      {isOpenEditPrescription && (
        <PrescriptionModal
          open={isOpenEditPrescription}
          onClose={() => onCloseEditPrescription(false)}
          item={prescriptionToEdit}
          isEdit={true}
          refresh={closePrescriptionModalsAndRefresh}
          leadId={contactId}
        />
      )}

      {isPrescriptionCoverageModalOpen && (
        <PrescriptionCoverageModal
          open={isPrescriptionCoverageModalOpen}
          onClose={() => setIsPrescriptionCoverageModalOpen(false)}
          prescriptions={prescriptionsList}
          planName={planData?.planName}
          refresh={closePrescriptionModalsAndRefresh}
          coveredDrugs={coveredPrescriptions}
          addNew={() => {
            setIsPrescriptionCoverageModalOpen(false);
            onAddNewPrescription();
          }}
          onEditPrescription={onEditPrescription}
        />
      )}

      {/* Pharmacy Modals  */}
      {isOpenPharmacyCoverageMOdal && (
        <Modal
          open={isOpenPharmacyCoverageMOdal}
          onClose={() => {
            setIsOpenPharmacyCoverageModal(false);
          }}
          hideFooter
          title={"Update Pharmacy"}
          isDelete={pharmaciesList?.length > 0}
          modalName={"Pharmacy"}
          onDelete={() => {
            deletePharmacy(pharmaciesList?.[0], contactId);
            setIsOpenPharmacyCoverageModal(false);
            refresh();
          }}
        >
          <UpdateView data={pharmaciesList?.[0]} />
        </Modal>
      )}
      {openAddPharmacyModal && (
        <AddPharmacy
          isOpen={openAddPharmacyModal}
          onClose={() => {
            setOpenAddPharmacyModal(false);
          }}
          personalInfo={contact}
          refresh={refresh}
          leadId={contactId}
        />
      )}
    </div>
  );
};

PlanCoverage.propTypes = {
  contactId: PropTypes.string.isRequired,
  planData: PropTypes.object.isRequired,
};
export default PlanCoverage;
