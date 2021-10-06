import React, { useRef } from "react";
import ScrollNav from "components/ui/ScrollNav";
import CompactPlanCard from "components/ui/PlanCard/compact";
import MapdCostTable from "components/ui/PlanDetailsTable/shared/cost-table";
import MapdProvidersTable from "components/ui/PlanDetailsTable/shared/providers-table";
import MapdPrescriptionsTable from "components/ui/PlanDetailsTable/shared/prescriptions-table";
import MapdPlanBenefitsTable from "components/ui/PlanDetailsTable/shared/plan-benefits-table";
import MapdPharmacyTable from "components/ui/PlanDetailsTable/shared/pharmacy-table";
import MapdPharmacyCoverageTable from "components/ui/PlanDetailsTable/shared/pharmacy-coverage-table";
import MapdTierPharmacyCoverage from "components/ui/PlanDetailsTable/mapd/tier-pharmacy-coverage";
import PlanDocumentsTable from "components/ui/PlanDetailsTable/shared/plan-documents-table";

export default ({ plan, isMobile, styles, onEnrollClick, onShareClick, pharmacies }) => {
  const costsRef = useRef(null);
  const providersRef = useRef(null);
  const prescriptionsRef = useRef(null);
  const pharmacyRef = useRef(null);
  const planBenefitsRef = useRef(null);
  const pharmacyCoverageRef = useRef(null);
  const preferredRetailPharmacyCoverageRef = useRef(null);
  const standardRetailPharmacyCoverageRef = useRef(null);
  const preferredMailOrderPharmacyCoverageRef = useRef(null);
  const standardMailOrderPharmacyCoverageRef = useRef(null);
  const planDocumentsRef = useRef(null);
  return (
    <>
      <div className={`${styles["left"]}`}>
        <ScrollNav
          initialSectionID="costs"
          scrollToInitialSection={false}
          isMobile={isMobile}
          sections={[
            {
              header: "Overview",
            },
            {
              id: "costs",
              label: "Costs",
            },
            {
              id: "providers",
              label: "Providers",
            },
            {
              id: "prescriptions",
              label: "Prescriptions",
            },
            {
              id: "pharmacy",
              label: "Pharmacy",
            },
            {
              header: "Plan Details",
            },
            {
              id: "planBenefits",
              label: "Plan Benefits",
            },
            {
              id: "pharmacyCoverage",
              label: "Pharmacy Coverage",
            },
            {
              id: "preferredRetailPharmacyCoverage",
              label: "Preferred Retail Pharmacy Coverage",
            },
            {
              id: "standardRetailPharmacyCoverage",
              label: "Standard Retail Pharmacy Coverage",
            },
            {
              id: "preferredMailOrderPharmacyCoverage",
              label: "Preferred Mail Order Pharmacy Coverage",
            },
            {
              id: "standardMailOrderPharmacyCoverage",
              label: "Standard Mail Order Pharmacy Coverage",
            },
            {
              id: "planDocuments",
              label: "Plan Documents",
            },
          ]}
          ref={{
            costs: costsRef,
            providers: providersRef,
            prescriptions: prescriptionsRef,
            pharmacy: pharmacyRef,
            planBenefits: planBenefitsRef,
            pharmacyCoverage: pharmacyCoverageRef,
            preferredRetailPharmacyCoverage: preferredRetailPharmacyCoverageRef,
            standardRetailPharmacyCoverage: standardRetailPharmacyCoverageRef,
            preferredMailOrderPharmacyCoverage: preferredMailOrderPharmacyCoverageRef,
            standardMailOrderPharmacyCoverage: standardMailOrderPharmacyCoverageRef,
            planDocuments: planDocumentsRef,
          }}
        />
      </div>
      <div className={`${styles["main"]}`}>
        <div className={`${styles["card-container"]}`}>
          {plan && (
            <CompactPlanCard
              planData={plan}
              onEnrollClick={onEnrollClick}
              onShareClick={onShareClick}
            />
          )}
        </div>
        <div ref={costsRef} className={`${styles["costs"]}`}>
          {plan && <MapdCostTable planData={plan} />}
        </div>
        <div ref={providersRef} className={`${styles["provider-details"]}`}>
          {plan && <MapdProvidersTable planData={plan} />}
        </div>
        <div
          ref={prescriptionsRef}
          className={`${styles["prescription-details"]}`}
        >
          {plan && <MapdPrescriptionsTable planData={plan} />}
        </div>
        <div ref={pharmacyRef} className={`${styles["pharmacy-details"]}`}>
          {plan && (
            <MapdPharmacyTable planData={plan} pharmacies={pharmacies} />
          )}
        </div>
        <div ref={planBenefitsRef} className={`${styles["plan-benefits"]}`}>
          {plan && <MapdPlanBenefitsTable planData={plan} />}
        </div>
        <div
          ref={pharmacyCoverageRef}
          className={`${styles["pharmacy-coverage"]}`}
        >
          {plan && <MapdPharmacyCoverageTable planData={plan} />}
        </div>
        <div
          ref={preferredRetailPharmacyCoverageRef}
          className={`${styles["preferred-retail-pharmacy"]}`}
        >
          {plan && (
            <MapdTierPharmacyCoverage
              header={"Preferred Retail Pharmacy Coverage"}
              planData={plan}
              isPreffered={true}
              isRetail={true}
            />
          )}
        </div>
        <div
          ref={standardRetailPharmacyCoverageRef}
          className={`${styles["standard-retail-pharmacy"]}`}
        >
          {plan && (
            <MapdTierPharmacyCoverage
              header={"Standard Retail Pharmacy Coverage"}
              planData={plan}
              isPreffered={false}
              isRetail={true}
            />
          )}
        </div>
        <div
          ref={preferredMailOrderPharmacyCoverageRef}
          className={`${styles["preferred-mail-order-pharmacy"]}`}
        >
          {plan && (
            <MapdTierPharmacyCoverage
              header={"Preferred Mail Order Pharmacy Coverage"}
              planData={plan}
              isPreffered={true}
              isRetail={false}
            />
          )}
        </div>
        <div
          ref={standardMailOrderPharmacyCoverageRef}
          className={`${styles["standard-mail-order-pharmacy"]}`}
        >
          {plan && (
            <MapdTierPharmacyCoverage
              header={"Standard Mail Order Pharmacy Coverage"}
              planData={plan}
              isPreffered={false}
              isRetail={false}
            />
          )}
        </div>
        <div ref={planDocumentsRef} className={`${styles["plan-documents"]}`}>
          <PlanDocumentsTable planData={plan} />
        </div>
      </div>
    </>
  );
};
