import React, { useState } from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Header from "./components/Header";
import Row from "./components/Row";
import Footer from "./components/Footer";
import PrescriptionModal from "components/SharedModals/PrescriptionModal";
import PrescriptionCoverageModal from "components/SharedModals/PrescriptionModal/PrescriptionCoverageModal";

const PrescriptionTable = ({
  prescriptions,
  isMobile,
  planDrugCoverage,
  drugCosts,
  planData,
  refresh,
  addPrescription,
  editPrescription,
  deletePrescription,
}) => {
  const [isOpenPrescription, setIsOpenPrescription] = useState(false);
  const [isOpenEditPrescription, setIsOpenEditPrescription] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState([]);
  const [coverageModal, setCoverageModal] = useState(false);

  const onCloseNewPrescription = () => setIsOpenPrescription(false);
  const onEditPrescription = (item) => {
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

  return (
    <PlanDetailsContactSectionCard
      title="Prescriptions"
      isDashboard={true}
      preferencesKey={"prescriptions_collapse"}
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
          onSave={addPrescription}
          refresh={refresh}
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
          refresh={refresh}
        />
      )}

      {coverageModal && (
        <PrescriptionCoverageModal
          open={coverageModal}
          onClose={() => setCoverageModal(false)}
          prescriptions={prescriptions}
          planName={planData?.planName}
          refresh={refresh}
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
