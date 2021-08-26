import React, { useEffect, useState } from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";
import DetailsCard from "components/ui/DetailsCard";
import AddPrescription from "./modals/AddPrescription";
import EditPrescription from "./modals/EditPrescription";
import AddPharmacy from "./modals/AddPharmacy";
import useLeadInformation from "hooks/useLeadInformation";
import CellData from "components/ui/DetailsTable/CellData";
import { formatPhoneNumber } from "utils/phones";
import AddProvider from "./modals/AddProvider";

import clientsService from "services/clientsService";
import useToast from "./../../../hooks/useToast";
import "./details.scss";

export default (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
  const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
  const {
    pharmacies,
    prescriptions,
    isLoading,
    addPrescription,
    editPrescription,
    deletePrescription,
    deletePharmacy,
  } = useLeadInformation(props.id);
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

  const [leadProviders, setLeadProviders] = useState({
    items: {},
    isLoading: true,
    error: null,
  });

  const onClose = () => setIsOpen(false);
  const addToast = useToast();

  async function handleUndo(provider) {
    const request = [
      {
        npi: provider.NPI,
        addressId: provider.addresses[0]?.id,
        isPrimary: false,
      },
    ];
    await fetchProviders();
    try {
      await clientsService.createLeadProvider(props.id, request);
      fetchProviders();
      addToast({
        type: "success",
        message: provider.presentationName + " added back to the list. ",
        time: 10000,
        onClickHandler: () => handleUndo(provider),
      });
    } catch (e) {
      addToast({
        type: "error",
        message: "Error, update unsuccessful.",
        time: 10000,
      });
    }
  }
  async function handleDeleteProvider(provider) {
    try {
      await clientsService.deleteProvider(
        props.id,
        provider.npi || provider.NPI
      );
      fetchProviders();
      addToast({
        type: "success",
        message: provider.presentationName + " deleted from Providers. ",
        time: 10000,
        link: "Undo",
        onClickHandler: () => handleUndo(provider),
      });
    } catch (e) {
      addToast({
        type: "error",
        message: "Error, delete unsuccessful.",
        time: 10000,
      });
    }
  }
  const fetchProviders = React.useCallback(async () => {
    setLeadProviders((prev) => ({ ...prev, isLoading: false }));
    try {
      const items = await clientsService.getLeadProviders(props.id);
      setLeadProviders({
        items,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setLeadProviders({
        items: [],
        isLoading: false,
        error,
      });
    }
  }, [props.id]);
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const PrescriptionRow = ({ item, className }) => {
    return (
      <div className={className}>
        <CellData header={item.drugName} />
        <CellData subText={`${item.daysOfSupply} capsule per day`} />
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
        {isOpen && (
          <AddProvider
            isOpen={isOpen}
            onClose={onClose}
            personalInfo={props.personalInfo}
          />
        )}
        <AddPrescription
          isOpen={isOpenPrescription}
          onClose={onCloseNewPrescription}
          onSave={addPrescription}
        />
        <EditPrescription
          isOpen={isOpenEditPrescription}
          onClose={onCloseEditPrescription}
          item={prescriptionToEdit}
          onSave={editPrescription}
        />
        <AddPharmacy isOpen={isOpenPharmacy} onClose={onCloseNewPharmacy} />
        <DetailsCard
          headerTitle="Providers"
          onAddClick={onAddNewProvider}
          items={leadProviders?.items?.providers || []}
          provider={true}
          itemRender={(item, index) => {
            return (
              <div
                style={{
                  background: index % 2 ? "white" : "#F1F5F9",
                }}
                className="provider-container"
              >
                <div className="provider-content">
                  <div className="pr-h1">{item.presentationName}</div>
                  <div className="pr-h2">
                    {item.specialty}&nbsp;/&nbsp;{item.title}
                  </div>
                  <div className="pr-h2">{item.email}</div>
                </div>
                <div className="provider-content">
                  <div className="pr-h1">{item.phone}</div>
                  <div className="pr-h2">
                    {item.addresses[0].streetLine1},&nbsp;
                  </div>
                  <div className="pr-h2">
                    {item.addresses[0].city},&nbsp;{item.addresses[0].state}
                    ,&nbsp;{item.addresses[0].zipCode}
                  </div>
                </div>
                <div>
                  <span
                    role="button"
                    className="pr-delete"
                    onClick={() => handleDeleteProvider(item)}
                  >
                    Delete
                  </span>
                </div>
              </div>
            );
          }}
        />
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
