import React, { useRef } from "react";
import ScrollNav from "components/ui/ScrollNav";
import CompactPlanCard from "components/ui/PlanCard/compact";
import MaCostTable from "components/ui/PlanDetailsTable/shared/cost-table";
import MaProvidersTable from "components/ui/PlanDetailsTable/shared/providers-table";
import MaPlanBenefitsTable from "components/ui/PlanDetailsTable/shared/plan-benefits-table";
import PlanDocumentsTable from "components/ui/PlanDetailsTable/shared/plan-documents-table";
import EnrollmentPlanCard from "components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard";

export default ({
  plan,
  isMobile,
  styles,
  onEnrollClick,
  onShareClick,
  isEnroll,
  enrollData,
  isEmail = false,
}) => {
  const costsRef = useRef(null);
  const providersRef = useRef(null);
  const planBenefitsRef = useRef(null);
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
              header: "Plan Details",
            },
            {
              id: "planBenefits",
              label: "Plan Benefits",
            },
            {
              id: "planDocuments",
              label: "Plan Documents",
            },
          ]}
          ref={{
            costs: costsRef,
            providers: providersRef,
            planBenefits: planBenefitsRef,
            planDocuments: planDocumentsRef,
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
              isEmail={isEmail}
            />
          )}
        </div>
        <div ref={costsRef} className={`${styles["costs"]}`}>
          {plan && (
            <MaCostTable isMobile={isMobile} planData={plan} planType="MA" />
          )}
        </div>
        <div ref={providersRef} className={`${styles["provider-details"]}`}>
          {plan && <MaProvidersTable isMobile={isMobile} planData={plan} />}
        </div>
        <div ref={planBenefitsRef} className={`${styles["plan-benefits"]}`}>
          {plan && <MaPlanBenefitsTable isMobile={isMobile} planData={plan} />}
        </div>
        <div ref={planDocumentsRef} className={`${styles["plan-documents"]}`}>
          <PlanDocumentsTable isMobile={isMobile} planData={plan} />
        </div>
      </div>
    </>
  );
};