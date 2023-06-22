import React, { useRef } from "react";
import ScrollNav from "components/ui/ScrollNav";
import CompactPlanCard from "components/ui/PlanCard/compact";
import PdpCostTable from "components/ui/PlanDetailsTable/shared/cost-table";
import PdpPrescriptionsTable from "components/ui/PlanDetailsTable/shared/prescriptions-table";
import PdpPharmacyTable from "components/ui/PlanDetailsTable/shared/pharmacy-table";
import PlanDocumentsTable from "components/ui/PlanDetailsTable/shared/plan-documents-table";
import PlanDetailsPharmacyCoverageContent from "./pharmacy-coverage-content";
import EnrollmentPlanCard from "components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard";

export default ({
  plan,
  isMobile,
  styles,
  onEnrollClick,
  onShareClick,
  pharmacies,
  isEnroll,
  enrollData,
}) => {
  const costsRef = useRef(null);
  const prescriptionsRef = useRef(null);
  const pharmacyRef = useRef(null);
  const pharmacyCoverageRef = useRef(null);
  const preferredRetailPharmacyCoverageRef = useRef(null);
  const standardRetailPharmacyCoverageRef = useRef(null);
  const preferredMailOrderPharmacyCoverageRef = useRef(null);
  const standardMailOrderPharmacyCoverageRef = useRef(null);
  const planDocumentsRef = useRef(null);
  const {
    hasPreferredRetailPharmacyNetwork,
    hasPreferredMailPharmacyNetwork,
    hasMailDrugBenefits,
  } = plan;
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
              id: "pharmacyCoverage",
              label: "Pharmacy Coverage",
            },
            {
              id: "standardRetailPharmacyCoverage",
              label: "Standard Retail Pharmacy Coverage",
            },
            ...(hasPreferredRetailPharmacyNetwork
              ? [
                  {
                    id: "preferredRetailPharmacyCoverage",
                    label: "Preferred Retail Pharmacy Coverage",
                  },
                ]
              : []),
            ...(hasPreferredMailPharmacyNetwork
              ? [
                  {
                    id: "preferredMailOrderPharmacyCoverage",
                    label: "Preferred Mail Order Pharmacy Coverage",
                  },
                ]
              : []),
            ...(hasMailDrugBenefits
              ? [
                  {
                    id: "standardMailOrderPharmacyCoverage",
                    label: "Standard Mail Order Pharmacy Coverage",
                  },
                ]
              : []),
            {
              id: "planDocuments",
              label: "Plan Documents",
            },
          ]}
          ref={{
            costs: costsRef,
            prescriptions: prescriptionsRef,
            pharmacy: pharmacyRef,
            pharmacyCoverage: pharmacyCoverageRef,
            planDocuments: planDocumentsRef,
            standardRetailPharmacyCoverage: standardRetailPharmacyCoverageRef,
            ...(hasPreferredRetailPharmacyNetwork && {
              preferredRetailPharmacyCoverage:
                preferredRetailPharmacyCoverageRef,
            }),
            ...(hasPreferredMailPharmacyNetwork && {
              preferredMailOrderPharmacyCoverage:
                preferredMailOrderPharmacyCoverageRef,
            }),
            ...(hasMailDrugBenefits && {
              standardMailOrderPharmacyCoverage:
                standardMailOrderPharmacyCoverageRef,
            }),
          }}
        />
      </div>
      <div className={`${styles["main"]}`}>
        <div className={`${styles["card-container"]}`}>
          {plan && !isEnroll ? (
            <CompactPlanCard
              planData={plan}
              onEnrollClick={onEnrollClick}
              onShareClick={onShareClick}
              isMobile={isMobile}
            />
          ) : (
            <EnrollmentPlanCard
              currentYear={false}
              submittedDate={enrollData.appSubmitDate}
              enrolledDate={enrollData.enrolledDate}
              effectiveDate={enrollData.policyEffectiveDate}
              policyId={enrollData.policyNumber}
              policyHolder={`${enrollData.consumerFirstName} ${enrollData.consumeLastName}`}
              leadId={enrollData.leadId}
              planId={enrollData.plan}
              agentNpn={enrollData.agentNpn}
              carrier={enrollData.carrier}
              consumerSource={enrollData.consumerSource}
              hasPlanDetails={enrollData.hasPlanDetails}
              policyStatus={enrollData.policyStatus}
              confirmationNumber={enrollData.confirmationNumber}
              isEnrollPlansPage={isEnroll}
              onShareClick={onShareClick}
            />
          )}
        </div>
        <div ref={costsRef} className={`${styles["costs"]}`}>
          {plan && (
            <PdpCostTable planData={plan} isMobile={isMobile} planType="PDP" />
          )}
        </div>
        <div
          ref={prescriptionsRef}
          className={`${styles["prescription-details"]}`}
        >
          {plan && (
            <PdpPrescriptionsTable planData={plan} isMobile={isMobile} />
          )}
        </div>
        <div ref={pharmacyRef} className={`${styles["pharmacy-details"]}`}>
          {plan && (
            <PdpPharmacyTable
              planData={plan}
              pharmacies={pharmacies}
              isMobile={isMobile}
            />
          )}
        </div>
        <PlanDetailsPharmacyCoverageContent
          plan={plan}
          styles={styles}
          refs={{
            pharmacyCoverageRef,
            preferredRetailPharmacyCoverageRef,
            standardRetailPharmacyCoverageRef,
            preferredMailOrderPharmacyCoverageRef,
            standardMailOrderPharmacyCoverageRef,
          }}
          isMobile={isMobile}
        />
        <div ref={planDocumentsRef} className={`${styles["plan-documents"]}`}>
          <PlanDocumentsTable planData={plan} isMobile={isMobile} />
        </div>
      </div>
    </>
  );
};
