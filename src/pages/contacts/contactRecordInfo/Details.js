import React, { useState } from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";
import DetailsCard from "components/ui/DetailsCard";
import AddProvider from "./modals/AddProvider";
import AddPrescription from "./modals/AddPrescription";
import AddPharmacy from "./modals/AddPharmacy";

export default (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);

  const onClose = () => setIsOpen(false);
  const onCloseNewPrescription = () => setIsOpenPrescription(false);
  const onCloseNewPharmacy = () => setIsOpenPharmacy(false);
  const onAddNewProvider = () => setIsOpen(true);
  const onAddNewPrescription = () => setIsOpenPrescription(true);
  const onAddNewPharmacy = () => setIsOpenPharmacy(true);

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
        <DetailsCard headerTitle="Providers" onAddClick={onAddNewProvider} />
        <DetailsCard
          headerTitle="Prescriptions"
          onAddClick={onAddNewPrescription}
        />
        <DetailsCard headerTitle="Pharamacies" onAddClick={onAddNewPharmacy} />
      </div>
    </>
  );
};
