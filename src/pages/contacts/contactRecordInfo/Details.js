import React, { useState, forwardRef } from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";
import DetailsCard from "components/ui/DetailsCard";
import AddPharmacy from "./modals/AddPharmacy";
import useLeadInformation from "hooks/useLeadInformation";
import CellData from "components/ui/DetailsTable/CellData";
import { formatPhoneNumber } from "utils/phones";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import DeleteLeadModal from "./DeleteLeadModal";
import "./details.scss";
import "./contactRecordInfo.scss";
import DetailsMobile from "mobile/Contact/Details/ContactDetails";
import Media from "react-media";
import EnrollmentHistoryContainer from "components/EnrollmentHistoryContainer/EnrollmentHistoryContainer";
import ProviderModal from "components/SharedModals/ProviderModal";
import RenderProviders from "components/ui/ProvidersList";

export default forwardRef((props) => {
  let { firstName = "", middleName = "", lastName = "" } = props?.personalInfo;

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
    pharmacies,
    prescriptions,
    providers,
    isLoading,
    addPharmacy,
    addPrescription,
    editPrescription,
    deletePrescription,
    deletePharmacy,
    addProvider,
    deleteProvider,
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
        <section>
          <EnrollmentHistoryContainer leadId={props.id} />
        </section>
      <div className="detailscard-container">
        {isOpen && (
          <ProviderModal
            open={isOpen}
            onClose={() => {
              setIsOpen(false);
              setProviderEditFlag(false);
              setProviderToEdit({});
            }}
            onSave={addProvider}
            onDelete={deleteProvider}
            userZipCode={props?.personalInfo?.addresses[0]?.postalCode}
            leadId={props.id}
            leadProviders={providers}
            selected={providerToEdit}
            isEdit={providerEditFlag}
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
            onDelete={deletePrescription}
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
            items={providers || []}
            provider={true}
            isLoading={isLoading}
            itemRender={(item) => {
              return (
                <div key={item?.NPI} className="provider-container">
                  <RenderProviders
                    provider={item}
                    setIsOpen={setIsOpen}
                    setProviderEditFlag={setProviderEditFlag}
                    setProviderToEdit={setProviderToEdit}
                  />
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
