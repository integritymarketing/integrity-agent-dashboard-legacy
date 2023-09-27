import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./PlanCoverage.module.scss";
import { Button } from "components/ui/Button";
import AddPharmacy from "pages/contacts/contactRecordInfo/modals/AddPharmacy";
import EditIcon from "components/icons/edit2";
import Modal from "components/Modal";
import PharmacySvg from "./assets/pharmacySvg";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import PrescriptionSvg from "./assets/prescriptionSvg";
import ProviderCard from "components/SharedModals/ProviderModal/ProviderList";
import ProviderModal from "components/SharedModals/ProviderModal";
import ProviderSvg from "./assets/providerSvg";
import UpdateView from "components/ui/PlanDetailsTable/shared/PharmacyTable/components/UpdateView/updateView";
import { useLeadInformation } from "hooks/useLeadInformation";
import Add from "components/icons/add";

const PlanCoverage = ({ contactId, contact, planData }) => {
  const { pharmacies, deletePharmacy, providers, prescriptions } =
    useLeadInformation() || {};
  const [currentModal, setCurrentModal] = useState(null);
  const [isOpenNewPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenNewProvider, setIsOpenNewProvider] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState(null);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState(null);

  const resetCurrentModal = useCallback(() => {
    setCurrentModal(null);
  }, []);

  const onAddNewProvider = () => setIsOpenNewProvider(true);
  const onAddNewPrescription = useCallback(
    () => setIsOpenPrescription(true),
    []
  );

  const addPharmacyText =
    pharmacies?.length > 0
      ? `${1} of ${pharmacies.length} Pharmacies Covered`
      : "Add Pharmacy";
  const addPrescriptionText =
    prescriptions?.length > 0
      ? `${1} of ${prescriptions.length} Prescriptions Covered`
      : "Add Prescriptions";
  const addProviderText =
    providers?.length > 0
      ? `${1} of ${providers.length} Provider Locations Covered`
      : "Add Providers";

  const handleClickItem = (item) => {
    setCurrentModal(item);
  };

  const showPharmacyModal = () => {
    if (pharmacies?.length > 0) {
      return (
        <Modal
          open={true}
          onClose={resetCurrentModal}
          hideFooter
          title={"Update Pharmacy"}
          isDelete
          modalName={"Pharmacy"}
          onDelete={() => {
            deletePharmacy(pharmacies?.[0]);
          }}
        >
          <UpdateView data={pharmacies?.[0]} />
        </Modal>
      );
    }
    return (
      <AddPharmacy
        isOpen={true}
        onClose={resetCurrentModal}
        personalInfo={contact}
      />
    );
  };

  const getNumberInText = (number) => {
    switch (number) {
      case 1:
        return "one month";
      case 2:
        return "two months";
      case 3:
        return "three months";
      case 4:
        return "four months";
      case 5:
        return "five months";
      case 6:
        return "six months";
      case 12:
        return "year";
      default:
        return "";
    }
  };

  const getDoseQuantity = (prescription) => {
    if (!prescription || !prescription.dosage) {
      return;
    }
    const { dosage } = prescription;
    const duration = getNumberInText(Math.floor(dosage.daysOfSupply / 30));
    if (dosage.selectedPackage) {
      return `${dosage.userQuantity} X ${dosage.selectedPackage.packageDisplayText} per ${duration}`;
    }

    return `${dosage.userQuantity} tablets per ${duration}`;
  };

  const renderProvidersList = () => {
    return (
      <div className={styles.listContainer}>
        <ProviderCard
          list={providers}
          disableAddressSelect
          onEditProvider={(provider) => {
            setProviderToEdit(provider);
          }}
        />
        <Button
          icon={<Add />}
          className={styles.addProviderBtn}
          label="Add New Provider"
          type="secondary"
          iconPosition="right"
          onClick={onAddNewProvider}
        />
      </div>
    );
  };
  const renderPrescriptionList = () => {
    return (
      <div className={styles.listContainer}>
        <div className={styles.prescriptionContainer}>
          {prescriptions.map((prescription) => {
            return (
              <div className={styles.left}>
                <div className={styles.data}>
                  <div className={`${styles.secondaryColor} ${styles.type}`}>
                    {prescription?.dosage?.drugType}
                  </div>
                  <div className={`${styles.primaryColor} ${styles?.name}`}>
                    {prescription?.dosage?.labelName}
                  </div>
                  <div className={`${styles.secondaryColor} ${styles?.dose}`}>
                    {getDoseQuantity(prescription)}
                  </div>
                </div>
                <div
                  className={styles.editBtn}
                  onClick={() => {
                    setPrescriptionToEdit(prescription);
                  }}
                >
                  <span>Edit</span>
                  <EditIcon />
                </div>
              </div>
            );
          })}
        </div>
        <Button
          icon={<Add />}
          className={styles.addProviderBtn}
          label="Add New Prescription"
          type="secondary"
          iconPosition="right"
          onClick={onAddNewPrescription}
        />
      </div>
    );
  };
  const showProviderModal = () => {
    const showAddNewProvider = isOpenNewProvider;
    const showEditProvider = providers?.length > 0;
    if (showAddNewProvider) {
      return (
        <ProviderModal
          open
          onClose={() => {
            resetCurrentModal();
            setIsOpenNewProvider(false);
          }}
          userZipCode={contact?.addresses?.[0]?.postalCode}
          leadId={contactId}
        />
      );
    }
    if (showEditProvider) {
      if (providerToEdit) {
        return (
          <ProviderModal
            open
            onClose={() => {
              setProviderToEdit(null);
            }}
            userZipCode={contact?.addresses?.[0]?.postalCode}
            leadId={contactId}
            selected={providerToEdit}
            isEdit
          />
        );
      }
      return (
        <Modal
          open={true}
          onClose={resetCurrentModal}
          hideFooter
          title="Provider Coverage"
          modalName="Provider"
        >
          {renderProvidersList()}
        </Modal>
      );
    }
  };

  const showPrescriptionModal = () => {
    if (isOpenNewPrescription) {
      return (
        <PrescriptionModal
          open
          onClose={() => {
            setIsOpenPrescription();
            resetCurrentModal();
          }}
        />
      );
    }
    if (prescriptions.length > 0) {
      if (prescriptionToEdit) {
        return (
          <PrescriptionModal
            open
            onClose={() => setPrescriptionToEdit(null)}
            item={prescriptionToEdit}
            isEdit
          />
        );
      }
      return (
        <Modal
          open
          onClose={resetCurrentModal}
          hideFooter
          title="Prescription Coverage"
          modalName="Prescription"
        >
          {renderPrescriptionList()}
        </Modal>
      );
    }
  };

  const showModal = () => {
    switch (currentModal) {
      case "pharmacy": {
        return showPharmacyModal();
      }
      case "provider": {
        return showProviderModal();
      }
      case "prescription": {
        return showPrescriptionModal();
      }
      default:
    }
  };

  return (
    <div>
      <div className={`${styles.heading}`}>Plan Coverage</div>
      {showModal()}
      <div className={`${styles.itemsContainer}`}>
        <div className={`${styles.item}`}>
          <PharmacySvg />
          <span
            onClick={() => {
              handleClickItem("pharmacy");
            }}
          >
            {addPharmacyText}
          </span>
        </div>
        <div className={`${styles.item}`}>
          <ProviderSvg />
          <span
            onClick={() => {
              handleClickItem("provider");
            }}
          >
            {addProviderText}
          </span>
        </div>
        <div className={`${styles.item}`}>
          <PrescriptionSvg />
          <span
            onClick={() => {
              handleClickItem("prescription");
            }}
          >
            {addPrescriptionText}
          </span>
        </div>
      </div>
    </div>
  );
};

PlanCoverage.propTypes = {
  contactId: PropTypes.string.isRequired,
  contact: PropTypes.object.isRequired,
  planData: PropTypes.object.isRequired,
};
export default PlanCoverage;
