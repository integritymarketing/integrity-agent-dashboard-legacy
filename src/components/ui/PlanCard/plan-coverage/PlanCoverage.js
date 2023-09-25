import { useState } from "react";
import styles from "./PlanCoverage.module.scss";
import PharmacySvg from "./assets/pharmacySvg";
import PrescriptionSvg from "./assets/prescriptionSvg";
import ProviderSvg from "./assets/providerSvg";
import AddPharmacy from "pages/contacts/contactRecordInfo/modals/AddPharmacy";
import Modal from "components/Modal";
import UpdateView from "components/ui/PlanDetailsTable/shared/PharmacyTable/components/UpdateView/updateView";
import { useLeadInformation } from "hooks/useLeadInformation";
import ProviderModal from "components/SharedModals/ProviderModal";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import DetailsCard from "components/ui/DetailsCard";
import RenderProviders from "components/ui/ProvidersList";

function PlanCoverage({ contactId, contact, planData }) {
  const {
    pharmacies,
    deletePharmacy,
    providers,
    addProvider,
    prescriptions,
    addPrescription,
    providerLoading,
  } = useLeadInformation() || {};
  const [currentModal, setCurrentModal] = useState(null);
  const [isOpenNewPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenNewProvider, setIsOpenNewProvider] = useState(false);
  const [isEditProvider, setIsEditProvider] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState(null);

  const resetCurrentModal = () => {
    setCurrentModal(null);
  };

  const onAddNewProvider = () => setIsOpenNewProvider(true);
  const onCloseNewProvider = () => setIsOpenNewProvider(false);

  const onAddNewPrescription = () => setIsOpenPrescription(true);
  const onCloseNewPrescription = () => setIsOpenPrescription(false);

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

  const showProviderModal = () => {
    if (isOpenNewProvider) {
      return (
        <ProviderModal
          open
          onClose={() => {
            resetCurrentModal();
            setIsOpenNewProvider();
          }}
          userZipCode={contact?.addresses?.[0]?.postalCode}
          leadId={contactId}
        />
      );
    }
    if (providers?.length > 0) {
      if (providerToEdit) {
        return (
          <ProviderModal
            open
            onClose={() => {
              setIsEditProvider(false);
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
          open
          onClose={resetCurrentModal}
          hideFooter
          title="Provider Coverage"
          modalName="Provider"
        >
          <DetailsCard
            dataGtm="section-provider"
            headerTitle="Providers"
            onAddClick={onAddNewProvider}
            items={providers || []}
            provider
            isLoading={providerLoading}
            itemRender={(item) => {
              return (
                <div key={item?.NPI} className="provider-container">
                  <RenderProviders
                    provider={item}
                    handleEditProvider={(provider) => {
                      setIsEditProvider(true);
                      setProviderToEdit(provider);
                    }}
                  />
                </div>
              );
            }}
          />
        </Modal>
      );
    }
  };

  const showPrescriptionModal = () => {
    return (
      <PrescriptionModal
        open
        onClose={resetCurrentModal}
        // item={prescriptionToEdit}
        // isEdit
      />
    );
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
}

export default PlanCoverage;
