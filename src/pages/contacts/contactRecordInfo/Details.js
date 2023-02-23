import React, { useEffect, useState, forwardRef } from "react";
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
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import DeleteLeadModal from "./DeleteLeadModal";
import "./details.scss";

export default forwardRef((props, ref) => {
  let { firstName = "", middleName = "", lastName = "" } = props?.personalInfo;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
  const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

  const {
    pharmacies,
    prescriptions,
    isLoading,
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

  const onClose = (opts) => {
    setIsOpen(false);
    if (opts && opts.refresh) {
      fetchProviders();
    }
  };
  const addToast = useToast();

  async function handleUndo(provider) {
    const request = [
      {
        npi: provider.NPI.toString(),
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
        provider?.addresses?.[0]?.id,
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

  const getFrequencyValue = (dayofSupply) => {
    const frequencyOptions = FREQUENCY_OPTIONS.filter(
      (option) => option.value === dayofSupply
    );
    const result = frequencyOptions[0].label;
    return result;
  };

  const PrescriptionRow = ({ item, className }) => {
    const { dosage, dosageDetails } = item;
    const {
      labelName,
      daysOfSupply,
      drugType,
      selectedPackage,
      metricQuantity,
    } = dosage;
    const selectPackageDetails = selectedPackage
      ? `${selectedPackage.commonUserQuantity} X ${
          selectedPackage.packageDisplayText
        } ${getFrequencyValue(daysOfSupply)}`
      : dosageDetails
      ? `${metricQuantity} ${dosageDetails.dosageFormName.toLowerCase()} ${getFrequencyValue(
          daysOfSupply
        )}`
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
      <div className="contactdetailscard" ref={props.detailsRef}>
        {props.isEdit ? <EditForm {...props} /> : <ContactDetails {...props} />}
      </div>
      <div className="detailscard-container">
        {isOpen && (
          <AddProvider
            isOpen={isOpen}
            onClose={onClose}
            personalInfo={props.personalInfo}
            leadId={props.id}
            leadProviders={leadProviders?.items?.providers || []}
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
        {isOpenPharmacy && (
          <AddPharmacy
            isOpen={isOpenPharmacy}
            onClose={onCloseNewPharmacy}
            personalInfo={props.personalInfo}
            onSave={addPharmacy}
          />
        )}
        <div ref={props.providersRef}>
          <DetailsCard
            dataGtm="section-provider"
            headerTitle="Providers"
            onAddClick={onAddNewProvider}
            items={leadProviders?.items?.providers || []}
            provider={true}
            itemRender={(item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    background: index % 2 ? "white" : "#F1F5F9",
                  }}
                  className="provider-container"
                >
                  <div className="provider-content">
                    <div className="pr-h1">{item?.presentationName}</div>
                    <div className="pr-h2 pr-title-mble">
                      {item?.specialty}&nbsp;/&nbsp;{item?.title}
                    </div>
                    <div className="pr-h2">{item?.email}</div>
                  </div>
                  <div className="provider-content">
                    <div className="pr-h1 pr-phone-mble">
                      {formatPhoneNumber(item.phone)}
                    </div>
                    <div className="pr-h2">
                      {`${
                        item?.addresses[0]?.streetLine1
                          ? item?.addresses[0]?.streetLine1 + ","
                          : ""
                      }`}
                      &nbsp;
                    </div>
                    <div className="pr-h2">
                      {`${
                        item?.addresses[0]?.city
                          ? item?.addresses[0]?.city + ","
                          : ""
                      }`}
                      &nbsp;
                      {`${
                        item?.addresses[0]?.stateCode
                          ? item?.addresses[0]?.stateCode + ","
                          : ""
                      }`}
                      &nbsp;
                      {item?.addresses[0]?.zipCode}
                    </div>
                  </div>
                  <div>
                    <span
                      role="button"
                      className="button-delete-provider"
                      onClick={() => handleDeleteProvider(item)}
                    >
                      Delete
                    </span>
                  </div>
                </div>
              );
            }}
          />
        </div>
        <div ref={props.prescriptionRef}>
          <DetailsCard
            dataGtm="section-prescription"
            headerTitle="Prescriptions"
            onAddClick={onAddNewPrescription}
            items={prescriptions}
            Row={PrescriptionRow}
            onDelete={deletePrescription}
            onEdit={onEditPrescription}
            isLoading={isLoading}
          />
        </div>
        <div ref={props.pharmacyRef}>
          <DetailsCard
            dataGtm="section-pharmacies"
            headerTitle="Pharmacies"
            onAddClick={onAddNewPharmacy}
            items={pharmacies}
            Row={PharamaciesRow}
            onDelete={deletePharmacy}
            isLoading={isLoading}
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
