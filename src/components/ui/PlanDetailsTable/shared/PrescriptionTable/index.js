import React, { useState } from "react";
import { useLeadInformation } from "hooks/useLeadInformation";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Header from "./components/Header";
import Row from "./components/Row";
import Footer from "./components/Footer";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import PrescriptionCoverageModal from "components/SharedModals/PrescriptionCoverageModal";
import IconButton from "components/IconButton";
import EditIcon from "components/icons/icon-edit";
import Plus from "components/icons/plus";

const PrescriptionTable = ({
  isMobile,
  planDrugCoverage,
  drugCosts,
  planData,
  refresh,
}) => {
  const { prescriptions } = useLeadInformation();

  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
  const [coverageModal, setCoverageModal] = useState(false);

  const onAddNewPrescription = () => setIsOpenPrescription(true);
  const onCloseNewPrescription = () => setIsOpenPrescription(false);
  const onEditPrescription = (item) => {
    setCoverageModal(false);
    setIsOpenEditPrescription(true);
    setPrescriptionToEdit(item);
  };
  const onCloseEditPrescription = () => setIsOpenEditPrescription(false);

  const data = (planDrugCoverage || []).map((planDrug, i) => ({
    ...planDrug,
    ...(drugCosts || [])[i],
  }));

  const coveredDrugs = data.filter((item) => item.tierNumber > 0);
  const nonCoveredDrugs = data.filter((item) => item.tierNumber === 0);

  const hasData = data?.length > 0;
  const isEdit = prescriptions?.length > 0 ? true : false;

  const handleAddEdit = () => {
    if (isEdit) {
      setCoverageModal(true);
    } else {
      onAddNewPrescription();
    }
  };

  const closeAllModalsAndRefresh = () => {
    onCloseNewPrescription(false);
    onCloseEditPrescription(false);
    setCoverageModal(false);
    refresh();
  };

  return (
    <PlanDetailsContactSectionCard
      title="Prescriptions"
      isDashboard={true}
      preferencesKey={"prescriptions_collapse"}
      actions={
        <IconButton
          label={isEdit ? "Edit" : "Add"}
          onClick={handleAddEdit}
          icon={isEdit ? <EditIcon /> : <Plus />}
        />
      }
    >
      {coveredDrugs?.length > 0 && (
        <>
          <Header isMobile={isMobile} isCovered />
          <Row
            isMobile={isMobile}
            drugDetails={coveredDrugs}
            isCovered
            prescriptions={prescriptions}
            onEditPrescription={onEditPrescription}
          />
        </>
      )}

      {nonCoveredDrugs?.length > 0 && (
        <div>
          <Header isMobile={isMobile} />
          <Row
            isMobile={isMobile}
            drugDetails={nonCoveredDrugs}
            prescriptions={prescriptions}
          />
        </div>
      )}
      {hasData && (
        <Footer
          isMobile={isMobile}
          planData={planData}
          count={coveredDrugs?.length + nonCoveredDrugs?.length}
        />
      )}
      {isOpenPrescription && (
        <PrescriptionModal
          open={isOpenPrescription}
          onClose={() => onCloseNewPrescription(false)}
          prescriptions={prescriptions}
          refresh={closeAllModalsAndRefresh}
        />
      )}

      {isOpenEditPrescription && (
        <PrescriptionModal
          open={isOpenEditPrescription}
          onClose={() => onCloseEditPrescription(false)}
          item={prescriptionToEdit}
          isEdit={true}
          refresh={closeAllModalsAndRefresh}
        />
      )}

      {coverageModal && (
        <PrescriptionCoverageModal
          open={coverageModal}
          onClose={() => setCoverageModal(false)}
          prescriptions={prescriptions}
          planName={planData?.planName}
          refresh={closeAllModalsAndRefresh}
          coveredDrugs={coveredDrugs}
          addNew={() => {
            setCoverageModal(false);
            onAddNewPrescription();
          }}
          onEditPrescription={onEditPrescription}
        />
      )}
    </PlanDetailsContactSectionCard>
  );
};

PrescriptionTable.propTypes = {
  prescriptions: PropTypes.array,
  isMobile: PropTypes.bool,
  planDrugCoverage: PropTypes.array,
  drugCosts: PropTypes.array,
  planData: PropTypes.object,
};

export default PrescriptionTable;
