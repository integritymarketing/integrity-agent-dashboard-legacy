import React from "react";
import TierPharmacyCoverage from "components/ui/PlanDetailsTable/mapd/tier-pharmacy-coverage";
import PharmacyCoverageTable from "components/ui/PlanDetailsTable/shared/pharmacy-coverage-table";

const PlanDetailsPharmacyCoverageContent = ({ plan, styles, refs }) => {
  return (
    <>
      <div ref={refs.pharmacyCoverageRef} className={styles.pharmacyCoverage}>
        <PharmacyCoverageTable planData={plan} />
      </div>
      <TierPharmacyCoverage
        header="Standard Retail Pharmacy Coverage"
        planData={plan}
        isPreffered={false}
        isRetail={true}
        ref={refs.standardRetailPharmacyCoverageRef}
        className={styles.standardRetailPharmacy}
      />
      {plan.hasPreferredRetailPharmacyNetwork && (
        <TierPharmacyCoverage
          header="Preferred Retail Pharmacy Coverage"
          planData={plan}
          isPreffered={true}
          isRetail={true}
          ref={refs.preferredRetailPharmacyCoverageRef}
          className={styles.preferredRetailPharmacy}
        />
      )}
      {plan.hasPreferredMailPharmacyNetwork && (
        <TierPharmacyCoverage
          header="Preferred Mail Order Pharmacy Coverage"
          planData={plan}
          isPreffered={true}
          isRetail={false}
          ref={refs.preferredMailOrderPharmacyCoverageRef}
          className={styles.preferredMailOrderPharmacy}
        />
      )}
      {plan.hasMailDrugBenefits && (
        <TierPharmacyCoverage
          header="Standard Mail Order Pharmacy Coverage"
          planData={plan}
          isPreffered={false}
          isRetail={false}
          ref={refs.standardMailOrderPharmacyCoverageRef}
          className={styles.standardMailOrderPharmacy}
        />
      )}
    </>
  );
};

export default PlanDetailsPharmacyCoverageContent;
