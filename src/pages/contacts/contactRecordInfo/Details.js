import React, { useEffect, useState, forwardRef } from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";
import DetailsCard from "components/ui/DetailsCard";
import AddPharmacy from "./modals/AddPharmacy";
import useLeadInformation from "hooks/useLeadInformation";
import useFeatureFlag from "hooks/useFeatureFlag";
import CellData from "components/ui/DetailsTable/CellData";
import { formatPhoneNumber } from "utils/phones";
import AddProvider from "./modals/AddProvider";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import clientsService from "services/clientsService";
import useToast from "./../../../hooks/useToast";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import DeleteLeadModal from "./DeleteLeadModal";
import "./details.scss";
import DetailsMobile from "mobile/Contact/Details/ContactDetails";
import Media from "react-media";
import EnrollmentHistoryContainer from "components/EnrollmentHistoryContainer/EnrollmentHistoryContainer";

export default forwardRef((props, ref) => {
  let { firstName = "", middleName = "", lastName = "" } = props?.personalInfo;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
  const [isOpenPharmacy, setIsOpenPharmacy] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isMyFeatureEnabled = useFeatureFlag("REACT_APP_EROLLMENT_HISTORY_FLAG");

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
    const result = frequencyOptions[0]?.label;
    return result;
  };

  const PrescriptionRow = ({ item, className }) => {
    const { dosage, dosageDetails } = item;
    const { labelName, daysOfSupply, drugType, selectedPackage, userQuantity } =
      dosage;
    const selectPackageDetails = selectedPackage
      ? `${userQuantity} X ${
          selectedPackage.packageDisplayText
        } ${getFrequencyValue(daysOfSupply)}`
      : dosageDetails
      ? `${userQuantity} ${dosageDetails.dosageFormName.toLowerCase()} ${getFrequencyValue(
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
          useFor="pharmacy"
        />
      </div>
    );
  };

  const DetailsInfo = () => {
    if (isMobile) {
      return <DetailsMobile {...props} />;
    } else {
      if (props.isEdit) {
        return <EditForm {...props} />;
      } else {
        return <ContactDetails {...props} />;
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
      <div className="contactdetailscard" ref={props.detailsRef}>
        {DetailsInfo()}
      </div>
      {!isMyFeatureEnabled && (
        <section>
          <EnrollmentHistoryContainer leadId={props.id} />
        </section>
      )}
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

        {isOpenPrescription && (
          <PrescriptionModal
            open={isOpenPrescription}
            onClose={() => onCloseNewPrescription(false)}
            onSave={addPrescription}
          />
        )}

        {isOpenEditPrescription && (
          <PrescriptionModal
            open={isOpenEditPrescription}
            onClose={() => onCloseEditPrescription(false)}
            item={prescriptionToEdit}
            onSave={editPrescription}
            isEdit={true}
          />
        )}

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
                <div key={index} className="provider-container">
                  <div className="provider-content">
                    <div className="pr-h2 pr-title-mble">
                      {item?.specialty}
                      {item?.title ? ` / ${item?.title}` : ""}
                    </div>
                    <div className="pr-h1">{item?.presentationName}</div>
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
