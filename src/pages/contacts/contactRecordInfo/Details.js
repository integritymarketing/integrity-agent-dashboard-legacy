import React, { useState } from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";
import DetailsCard from "components/ui/DetailsCard";
import AddProvider from "./modals/AddProvider";
import AddPrescription from "./modals/AddPrescription";
import AddPharmacy from "./modals/AddPharmacy";
import useLeadInformation from "hooks/useLeadInformation";
import CellData from "components/ui/DetailsTable/CellData";
import { formatPhoneNumber } from "utils/phones";


export default (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);
  const {
    pharmacies,
    providers,
    prescriptions,
    isLoading,
    isSaving,
    addPharmacy,
    addPrescription,
    addProvider,
    deletePrescription,
  } = useLeadInformation(props.id);
  const onClose = () => setIsOpen(false);
  const onCloseNewPrescription = () => setIsOpenPrescription(false);
  const onCloseNewPharmacy = () => setIsOpenPharmacy(false);
  const onAddNewProvider = () => setIsOpen(true);
  const onAddNewPrescription = () => setIsOpenPrescription(true);
  const onAddNewPharmacy = () => setIsOpenPharmacy(true);



  const PrescriptionRow = ({ item, className }) => {

    return (
      <div className={className}>
        <CellData
          header={item.drugName}
          subText={`${item.daysOfSupply} capsule per day`}
        />
        <CellData header={item.labelName} subText={item.ndc} />
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
        <AddProvider isOpen={isOpen} onClose={onClose} />
        <AddPrescription
          isOpen={isOpenPrescription}
          onClose={onCloseNewPrescription}
        />
        <AddPharmacy isOpen={isOpenPharmacy} onClose={onCloseNewPharmacy} />
        <DetailsCard
          headerTitle="Providers"
          onAddClick={onAddNewProvider}
          items={providers}
          isLoading={isLoading}
        />
        <DetailsCard
          headerTitle="Prescriptions"
          onAddClick={onAddNewPrescription}
          items={prescriptions}
          Row={PrescriptionRow}
          onDelete={deletePrescription}
          onEdit={addPrescription}
          isLoading={isLoading}
        />
        <DetailsCard
          headerTitle="Pharamacies"
          onAddClick={onAddNewPharmacy}
          items={pharmacies}
          Row={PharamaciesRow}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
