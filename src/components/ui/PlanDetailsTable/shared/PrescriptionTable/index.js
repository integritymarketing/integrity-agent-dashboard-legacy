import React from "react";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import Header from "./components/Header";
import Row from "./components/Row";
import Footer from "./components/Footer";
import Edit from "./components/Edit";

function PrescriptionTable({
  prescriptions,
  isMobile,
  planDrugCoverage,
  drugCosts,
  planData,
}) {
  const data = (planDrugCoverage || []).map((planDrug, i) => {
    return {
      ...planDrug,
      ...(drugCosts || [])[i],
    };
  });

  const coveredDrugs = data?.filter((item) => item?.tierNumber > 0);
  const nonCoveredDrugs = data?.filter((item) => item?.tierNumber === 0);

  return (
    <PlanDetailsContactSectionCard
      title="Prescriptions"
      isDashboard={true}
      preferencesKey={"costTemp_collapse"}
      {...(data?.length && { actions: <Edit /> })}
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
        <>
          <Header isMobile={isMobile} />
          <Row
            isMobile={isMobile}
            drugDetails={nonCoveredDrugs}
            prescriptions={prescriptions}
          />
        </>
      )}
      <Footer
        isMobile={isMobile}
        planData={planData}
        count={coveredDrugs?.length + nonCoveredDrugs?.length}
      />
    </PlanDetailsContactSectionCard>
  );
}

export default PrescriptionTable;
