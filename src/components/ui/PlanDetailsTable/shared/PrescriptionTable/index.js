import React from "react";
import PropTypes from "prop-types";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Header from "./components/Header";
import Row from "./components/Row";
import Footer from "./components/Footer";
import Edit from "components/Edit";

const PrescriptionTable = ({
  prescriptions,
  isMobile,
  planDrugCoverage,
  drugCosts,
  planData,
}) => {
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
      {...(hasData && { actions: <Edit /> })}
    >
      {coveredDrugs?.length > 0 && (
        <>
          <Header isMobile={isMobile} isCovered />
          <Row
            isMobile={isMobile}
            drugDetails={coveredDrugs}
            isCovered
            prescriptions={prescriptions}
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
