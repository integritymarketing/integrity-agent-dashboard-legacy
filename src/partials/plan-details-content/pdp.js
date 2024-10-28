import { useRef } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import PdpCostTable from "components/ui/PlanDetailsTable/shared/cost-table";
import PdpPharmacyTable from "components/ui/PlanDetailsTable/shared/PharmacyTable/pharmacy-table";
import PlanDocumentsTable from "components/ui/PlanDetailsTable/shared/plan-documents-table";
import PlanDetailsPharmacyCoverageContent from "./pharmacy-coverage-content";
import EnrollmentPlanCard from "components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard";
import PlanDetailsScrollNav from "components/ui/PlanDetailsScrollNav";
import CompactPlanCardNew from "components/ui/PlanCard/CompactNew";
import PrescriptionTable from "components/ui/PlanDetailsTable/shared/PrescriptionTable";
import MailOrderNotApplicable from "components/MailOrderNotApplicable";
import PharmacyFilter from "components/ui/PharmacyFilter";
import { useHealth } from "providers/ContactDetails";
import { usePharmacyContext } from "providers/PharmacyProvider";

const PdpDetailsContent = ({
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
    leadId,
}) => {
    const location = useLocation();
    const { pharmacies: pharmaciesList } = useHealth() || {};
    const { selectedPharmacy } = usePharmacyContext();

    const pharmacyCosts = selectedPharmacy.pharmacyId
        ? plan?.pharmacyCosts.find((rx) => rx?.pharmacyId == selectedPharmacy.pharmacyId)
        : plan?.pharmacyCosts.find((rx) => rx?.pharmacyType === 2 || rx?.isMailOrder);

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
        estimatedAnnualMailOrderDrugCostPartialYear,
    } = plan;

    const mailOrderNotApplicable =
        selectedPharmacy?.name === "Mail Order" &&
        ((hasMailDrugBenefits && estimatedAnnualMailOrderDrugCostPartialYear === null) || !hasMailDrugBenefits);

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
                            productCategory={enrollData.productCategory}
                        />
                    )}
                </div>

                {isMobile && <PharmacyFilter type="select" />}

                <div ref={costsRef} className={`${styles["costs"]}`}>
                    {plan && <PdpCostTable planData={plan} isMobile={isMobile} planType="PDP" />}
                </div>
                <MailOrderNotApplicable
                    mailOrderNotApplicable={mailOrderNotApplicable}
                    pharmaciesList={pharmaciesList}
                    contact={contact}
                    refresh={refresh}
                    leadId={leadId}
                />
                <div ref={prescriptionsRef} className={`${styles["prescription-details"]}`}>
                    {plan && (
                        <PrescriptionTable
                            planData={plan}
                            isMobile={isMobile}
                            planDrugCoverage={plan?.planDrugCoverage}
                            drugCosts={pharmacyCosts}
                            refresh={refresh}
                            isEnroll={isEnroll}
                            leadId={leadId}
                        />
                    )}
                </div>
                <div ref={pharmacyRef} className={`${styles["pharmacy-details"]}`}>
                    {plan && !isEnroll && (
                        <PdpPharmacyTable
                            contact={contact}
                            planData={plan}
                            isMobile={isMobile}
                            refresh={refresh}
                            isEnroll={isEnroll}
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

PdpDetailsContent.propTypes = {
    contact: PropTypes.object.isRequired,
    plan: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    onEnrollClick: PropTypes.func.isRequired,
    onShareClick: PropTypes.func.isRequired,
    pharmacies: PropTypes.array.isRequired,
    isEnroll: PropTypes.bool,
    enrollData: PropTypes.object,
    isEmail: PropTypes.bool,
    refresh: PropTypes.func.isRequired,
    leadId: PropTypes.string.isRequired,
};

export default PdpDetailsContent;
