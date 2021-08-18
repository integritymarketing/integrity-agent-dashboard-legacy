import React, { useState } from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";
import DetailsCard from "components/ui/DetailsCard";
import AddPrescription from "./modals/AddPrescription";
import EditPrescription from "./modals/EditPrescription";
import AddPharmacy from "./modals/AddPharmacy";
import useLeadInformation from "hooks/useLeadInformation";
import CellData from "components/ui/DetailsTable/CellData";
import { formatPhoneNumber } from "utils/phones";

export default (props) => {
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
  const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
  const {
    pharmacies,
    prescriptions,
    isLoading,
    isSaving,
    addPharmacy,
    addPrescription,
    editPrescription,
    deletePrescription,
    deletePharmacy,
  } = useLeadInformation(props.id);
  const onAddNewPrescription = () => setIsOpenPrescription(true);
  const onCloseNewPrescription = () => setIsOpenPrescription(false);
  const onEditPrescription = (item) => { 
    setIsOpenEditPrescription(true);
    setPrescriptionToEdit(item)
  }
  const onCloseEditPrescription = () => setIsOpenEditPrescription(false);
  const onAddNewPharmacy = () => setIsOpenPharmacy(true);
  const onCloseNewPharmacy = () => setIsOpenPharmacy(false);

  const PrescriptionRow = ({ item, className }) => {
    return (
      <div className={className}>
        <CellData header={item.drugName} />
        <CellData
          subText={`${item.daysOfSupply} capsule per day`}
          subText={item.ndc}
        />
      </div>
    );
  };

  const PharamaciesRow = ({ item, className }) => {
    const address = `${item.address1} ${item.address2 ?? ""} ${item.city} ${
      item.state
    } ${item.zip}`;
    const phone = formatPhoneNumber(item.pharmacyPhone);
    return (
      <div className={className}>
        <CellData
          header={item.name}
          subText={address}
          secondarySubText={phone}
        />
      </div>
    );
  };

  return (
    <>
      <div className="contactdetailscard">
        {props.isEdit ? <EditForm {...props} /> : <ContactDetails {...props} />}
      </div>
      <div className="detailscard-container">
        <AddPrescription
          isOpen={isOpenPrescription}
          onClose={onCloseNewPrescription}
        />
        <EditPrescription
          isOpen={isOpenEditPrescription}
          onClose={onCloseEditPrescription}
          item={prescriptionToEdit}
          onSave={editPrescription}
        />
        <AddPharmacy isOpen={isOpenPharmacy} onClose={onCloseNewPharmacy} />
        <DetailsCard
          headerTitle="Prescriptions"
          onAddClick={onAddNewPrescription}
          items={prescriptions}
          Row={PrescriptionRow}
          onDelete={deletePrescription}
          onEdit={onEditPrescription}
          isLoading={isLoading}
        />
        <DetailsCard
          headerTitle="Pharmacies"
          onAddClick={onAddNewPharmacy}
          items={pharmacies}
          Row={PharamaciesRow}
          onDelete={deletePharmacy}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
