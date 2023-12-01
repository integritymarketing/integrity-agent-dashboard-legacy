import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import PlanDetailsScrollNav from "components/ui/PlanDetailsScrollNav";
import MapdCostTable from "components/ui/PlanDetailsTable/shared/cost-table";
import MapdPlanBenefitsTable from "components/ui/PlanDetailsTable/shared/plan-benefits-table";
import MapdPharmacyTable from "components/ui/PlanDetailsTable/shared/PharmacyTable/pharmacy-table";
import PlanDocumentsTable from "components/ui/PlanDetailsTable/shared/plan-documents-table";
import PlanDetailsPharmacyCoverageContent from "./pharmacy-coverage-content";
import EnrollmentPlanCard from "components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard";
import CompactPlanCardNew from "components/ui/PlanCard/CompactNew";
import PrescriptionTable from "components/ui/PlanDetailsTable/shared/PrescriptionTable";
import ProvidersTableV2 from "components/ui/PlanDetailsTable/shared/ProvidersTableV2";

const MapdDetailsContent = ({
    contact,
    plan,
    isMobile,
    styles,
    onEnrollClick,
    onShareClick,
    isEnroll = false,
    enrollData,
    isEmail = false,
    refresh,
    leadId
}) => {
    const location = useLocation();
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
    const { hasPreferredRetailPharmacyNetwork, hasPreferredMailPharmacyNetwork, hasMailDrugBenefits } = plan;

    return (
        <>
            <div className={`${styles["left"]}`}>
                <PlanDetailsScrollNav
                    initialSectionID="costs"
                    scrollToInitialSection={false}
                    isMobile={isMobile}
                    hidePharmacy={location.pathname.includes("/enrollmenthistory/")}
                    sections={[
                        {
                            header: "Overview",
                        },
                        {
                            id: "costs",
                            label: "Estimated Costs",
                        },
                        {
                            id: "prescriptions",
                            label: "Prescriptions",
                        },
                        {
                            id: "providers",
                            label: "Providers",
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
                        providers: providersRef,
                        pharmacy: pharmacyRef,
                        planBenefits: planBenefitsRef,
                        pharmacyCoverage: pharmacyCoverageRef,
                        planDocuments: planDocumentsRef,
                        standardRetailPharmacyCoverage: standardRetailPharmacyCoverageRef,
                        ...(hasPreferredRetailPharmacyNetwork && {
                            preferredRetailPharmacyCoverage: preferredRetailPharmacyCoverageRef,
                        }),
                        ...(hasPreferredMailPharmacyNetwork && {
                            preferredMailOrderPharmacyCoverage: preferredMailOrderPharmacyCoverageRef,
                        }),
                        ...(hasMailDrugBenefits && {
                            standardMailOrderPharmacyCoverage: standardMailOrderPharmacyCoverageRef,
                        }),
                    }}
                />
            </div>
            <div className={`${styles["main"]}`}>
                <div className={`${styles["card-container"]}`}>
                    {plan && !isEnroll ? (
                        <CompactPlanCardNew
                            planData={plan}
                            onEnrollClick={onEnrollClick}
                            onShareClick={onShareClick}
                            isMobile={isMobile}
                        />
                    ) : (
                        <EnrollmentPlanCard
                            currentYear={enrollData.currentYear}
                            submittedDate={enrollData.submitDate || "Not Provided by Carrier"}
                            enrolledDate={enrollData.enrolledDate}
                            policyEffectiveDate={enrollData.policyEffectiveDate}
                            policyId={enrollData.policyId}
                            policyHolder={enrollData.policyHolder}
                            leadId={enrollData.leadId}
                            planId={enrollData.planId}
                            agentNpn={enrollData.agentNpn}
                            carrier={enrollData.carrier}
                            consumerSource={enrollData.consumerSource}
                            hasPlanDetails={enrollData.hasPlanDetails}
                            policyStatus={enrollData.policyStatus}
                            confirmationNumber={enrollData.confirmationNumber}
                            isEnrollPlansPage={isEnroll}
                            onShareClick={onShareClick}
                            isEmail={isEmail}
                            planName={enrollData.planName}
                            policyStatusColor={enrollData.policyStatusColor}
                        />
                    )}
                </div>
                <div ref={costsRef} className={`${styles["costs"]}`}>
                    {plan && <MapdCostTable isMobile={isMobile} planData={plan} planType="MAPD" />}
                </div>
                <div ref={prescriptionsRef} className={`${styles["prescription-details"]}`}>
                    {plan && (
                        <PrescriptionTable
                            planData={plan}
                            isMobile={isMobile}
                            planDrugCoverage={plan?.planDrugCoverage}
                            drugCosts={plan?.pharmacyCosts?.[0]?.drugCosts}
                            refresh={refresh}
                            isEnroll={isEnroll}
                            leadId={leadId}
                        />
                    )}
                </div>
                <div ref={providersRef} className={`${styles["provider-details"]}`}>
                    {plan && (
                        <ProvidersTableV2
                            isMobile={isMobile}
                            refresh={refresh}
                            providers={plan?.providers}
                            planName={plan?.planName}
                            isEnroll={isEnroll}
                        />
                    )}
                </div>
                <div ref={pharmacyRef} className={`${styles["pharmacy-details"]}`}>
                    {plan && !isEnroll && (
                        <MapdPharmacyTable
                            contact={contact}
                            isMobile={isMobile}
                            planData={plan}
                            refresh={refresh}
                            isEnroll={isEnroll}
                        />
                    )}
                </div>
                <div ref={planBenefitsRef} className={`${styles["plan-benefits"]}`}>
                    {plan && <MapdPlanBenefitsTable planData={plan} />}
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
                />
                <div ref={planDocumentsRef} className={`${styles["plan-documents"]}`}>
                    <PlanDocumentsTable planData={plan} />
                </div>
            </div>
        </>
    );
};

export default MapdDetailsContent;
