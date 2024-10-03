import { useRef } from "react";
import PropTypes from "prop-types";
import MaCostTable from "components/ui/PlanDetailsTable/shared/cost-table";
import MaPlanBenefitsTable from "components/ui/PlanDetailsTable/shared/plan-benefits-table";
import PlanDocumentsTable from "components/ui/PlanDetailsTable/shared/plan-documents-table";
import EnrollmentPlanCard from "components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard";
import PlanDetailsScrollNav from "components/ui/PlanDetailsScrollNav";
import CompactPlanCardNew from "components/ui/PlanCard/CompactNew";
import ProvidersTableV2 from "components/ui/PlanDetailsTable/shared/ProvidersTableV2";
import MailOrderNotApplicable from "components/MailOrderNotApplicable";
import PharmacyFilter from "components/ui/PharmacyFilter";
import { useHealth } from "providers/ContactDetails";
import { usePharmacyContext } from "providers/PharmacyProvider";

const MaDetailsContent = ({
    plan,
    isMobile,
    styles,
    onEnrollClick,
    onShareClick,
    isEnroll,
    enrollData,
    isEmail = false,
    refresh,
    contact = {}
}) => {
    const { pharmacies: pharmaciesList } = useHealth() || {};
    const { selectedPharmacy } = usePharmacyContext();
    const { leadId } = contact || {};
    const costsRef = useRef(null);
    const prescriptionsRef = useRef(null);
    const providersRef = useRef(null);
    const planBenefitsRef = useRef(null);
    const planDocumentsRef = useRef(null);

    const { hasMailDrugBenefits, estimatedAnnualMailOrderDrugCostPartialYear } = plan;

    const mailOrderNotApplicable =
        selectedPharmacy?.name === "Mail Order" &&
        ((hasMailDrugBenefits && !estimatedAnnualMailOrderDrugCostPartialYear) || !hasMailDrugBenefits);

    return (
        <>
            <div className={`${styles["left"]}`}>
                <PlanDetailsScrollNav
                    initialSectionID="costs"
                    scrollToInitialSection={false}
                    isMobile={isMobile}
                    sections={[
                        {
                            header: "Overview",
                        },
                        {
                            id: "costs",
                            label: "Estimated Costs",
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
                        prescriptions: prescriptionsRef,
                        providers: providersRef,
                        planBenefits: planBenefitsRef,
                        planDocuments: planDocumentsRef,
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
                    {plan && <MaCostTable isMobile={isMobile} planData={plan} planType="MA" />}
                </div>
                <MailOrderNotApplicable
                    mailOrderNotApplicable={mailOrderNotApplicable}
                    pharmaciesList={pharmaciesList}
                    contact={contact}
                    refresh={refresh}
                    leadId={leadId}
                />
                <div ref={providersRef} className={`${styles["provider-details"]}`}>
                    {plan && (
                        <ProvidersTableV2
                            isMobile={isMobile}
                            providers={plan.providers}
                            refresh={refresh}
                            planName={plan?.planName}
                            isEnroll={isEnroll}
                            contact={contact}
                        />
                    )}
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

MaDetailsContent.propTypes = {
    plan: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    onEnrollClick: PropTypes.func.isRequired,
    onShareClick: PropTypes.func.isRequired,
    isEnroll: PropTypes.bool,
    enrollData: PropTypes.object,
    isEmail: PropTypes.bool,
    refresh: PropTypes.func.isRequired,
    contact: PropTypes.shape({
    leadId: PropTypes.string,
    }).isRequired,
};

export default MaDetailsContent;
