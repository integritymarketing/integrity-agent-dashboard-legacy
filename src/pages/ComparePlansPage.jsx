import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useParams } from "react-router-dom";

import useRoles from "hooks/useRoles";

import NonRTSBanner from "components/Non-RTS-Banner";
import BackButton from "components/BackButton";
import ComparePlanModal from "components/ui/ComparePlanModal";
import ComparePlansByPlanName from "components/ui/ComparePlansByPlanName";
import { CostCompareTable } from "components/ui/PlanDetailsTable/shared/cost-table";
import { PharmaciesCompareTable } from "components/ui/PlanDetailsTable/shared/pharmacies-compare-table";
import { PharmacyCoverageCompareTable } from "components/ui/PlanDetailsTable/shared/pharmacy-coverage-compare-table";
import { PlanBenefitsCompareTable } from "components/ui/PlanDetailsTable/shared/plan-benefits-compare-table";
import { PlanDocumentsCompareTable } from "components/ui/PlanDetailsTable/shared/plan-documents-compare-table";
import { PrescriptionsCompareTable } from "components/ui/PlanDetailsTable/shared/prescriptions-compare-table";
import { ProvidersCompareTable } from "components/ui/PlanDetailsTable/shared/providers-compare-table";
import { RetailPharmacyCoverage } from "components/ui/PlanDetailsTable/shared/retail-pharmacy-coverage-compare-table";
import Spinner from "components/ui/Spinner/index";
import WithLoader from "components/ui/WithLoader";
import Container from "components/ui/container";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import WelcomeEmailUser from "partials/welcome-email-user";

import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";

import styles from "./PlansPage.module.scss";

import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import PharmacyFilter from "components/ui/PharmacyFilter";
import MailOrderNotApplicable from "components/MailOrderNotApplicable";
import { useLeadDetails } from "providers/ContactDetails";
import { usePharmacyContext } from "../providers/PharmacyProvider";
import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { Box, Typography } from "@mui/material";
import { MEDICARE_ADVANTAGE } from "components/AddZipContainer/AddZipContainer.constants";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";

const ComparePlansPage = (props) => {
    const { contactId: id, planIds: comparePlanIds, effectiveDate } = useParams();
    const { isComingFromEmail, agentInfo = {}, footer = true } = props;
    const isFullYear = parseInt(effectiveDate?.split("-")?.[1], 10) < 2;
    const planIds = useMemo(() => comparePlanIds.split(","), [comparePlanIds]);
    const [loading, setLoading] = useState(true);
    const [plansLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [comparePlans, setComparePlans] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [comparePlanModalOpen, setComparePlanModalOpen] = useState(false);
    const [contactData, setContactData] = useState({});
    const [hasErrorPrescriptions, setHasErrorPrescriptions] = useState(false);
    const [hasErrorPharmacies, setHasErrorPharmacies] = useState(false);
    const [mailOrderNotApplicable, setMailOrderNotApplicable] = useState(false);

    const { clientsService, comparePlansService, plansService } = useClientServiceContext();
    const { leadDetails } = useLeadDetails();
    const { pharmacies: pharmaciesList, fetchPharmacies } = useHealth() || {};
    const { selectedPharmacy } = usePharmacyContext();
    const { isNonRTS_User } = useRoles();

    function getAllPlanDetails({
        planIds,
        contactId,
        contactData,
        effectiveDate,
        isComingFromEmail,
        agentNPN,
        agentInfo,
    }) {
        const primaryPharmacy =
            pharmaciesList.length > 0 ? pharmaciesList.find((pharmacy) => pharmacy.isPrimary)?.pharmacyId : null;
        const pharmacyId = selectedPharmacy?.pharmacyId || primaryPharmacy;

        return Promise.all(
            planIds
                .filter(Boolean)
                .map((planId) =>
                    !isComingFromEmail
                        ? plansService.getPlan(contactId, planId, contactData, effectiveDate, pharmacyId)
                        : comparePlansService.getPlan(contactId, planId, agentInfo, effectiveDate, agentNPN, pharmacyId)
                )
        );
    }

    const getContactRecordInfo = useCallback(async () => {
        setLoading(true);
        try {
            setResults([]);
            let contactData = {};

            if (!isComingFromEmail) {
                contactData = await clientsService.getContactInfo(id);
                setContactData(contactData);
            }
            await fetchPharmacies(id);
            const plansData = await getAllPlanDetails({
                planIds,
                contactId: id,
                contactData,
                effectiveDate,
                isComingFromEmail,
                agentInfo,
                agentNPN: agentInfo?.AgentNpn,
            });
            setResults(plansData);

            if (!isComingFromEmail) {
                try {
                    const prescriptionData = await clientsService.getLeadPrescriptions(id);
                    setPrescriptions(prescriptionData);
                } catch (prescriptionError) {
                    setHasErrorPrescriptions(true);
                    Sentry.captureException(prescriptionError);
                }

                try {
                    const pharmacyData = await clientsService.getLeadPharmacies(id);
                    setPharmacies(pharmacyData || []);
                } catch (pharmacyError) {
                    setHasErrorPharmacies(true);
                    Sentry.captureException(pharmacyError);
                }
            } else {
                try {
                    const prescriptionData = await comparePlansService.getLeadPrescriptions(id, agentInfo?.AgentNpn);
                    setPrescriptions(prescriptionData);
                } catch (prescriptionError) {
                    setHasErrorPrescriptions(true);
                    Sentry.captureException(prescriptionError);
                }

                try {
                    const pharmacyData = await comparePlansService.getLeadPharmacies(id, agentInfo?.AgentNpn);
                    setPharmacies(pharmacyData || []);
                } catch (pharmacyError) {
                    setHasErrorPharmacies(true);
                    Sentry.captureException(pharmacyError);
                }
            }

            analyticsService.fireEvent("event-content-load", {
                pagePath: "/plans/:contactId",
            });
        } catch (e) {
            Sentry.captureException(e);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isComingFromEmail, planIds, id, effectiveDate]);

    useEffect(() => {
        if (results && results.length) {
            setComparePlans(results?.filter((plan) => planIds.includes(plan?.id)));
            const mailOrdrNotApplicable = results?.every((plan) => {
                if (!plan) {
                    return false;
                }
                const { hasMailDrugBenefits, estimatedAnnualMailOrderDrugCostPartialYear } = plan;
                return (
                    selectedPharmacy?.name === "Mail Order" &&
                    Boolean(
                        (hasMailDrugBenefits && estimatedAnnualMailOrderDrugCostPartialYear === null) ||
                            !hasMailDrugBenefits
                    )
                );
            });
            setMailOrderNotApplicable(mailOrdrNotApplicable);
        }
    }, [planIds, results, selectedPharmacy]);

    useEffect(() => {
        id && getContactRecordInfo();
    }, [getContactRecordInfo, id]);

    const handleRemovePlan = (planId) => {
        setComparePlans((prevPlans) => {
            const plansUpdated = prevPlans?.filter((plan) => plan.id !== planId);
            const jsonStr = sessionStorage.getItem("__plans__");
            const parseStr = jsonStr ? JSON.parse(jsonStr) : {};
            sessionStorage.setItem("__plans__", JSON.stringify({ ...parseStr, plans: plansUpdated }));

            return plansUpdated;
        });
    };

    const getComparePlansByPlanNamesProps = () => {
        return {
            agentInfo,
            comparePlans,
            isEmail: isComingFromEmail,
            setComparePlanModalOpen,
            handleRemovePlan,
            id,
            plansLoading,
            contactData,
        };
    };

    const isLoading = loading;

    if (loading) {
        return <Spinner />;
    }
    return (
        <>
            {!isComingFromEmail && (
                <ComparePlanModal
                    modalOpen={comparePlanModalOpen}
                    handleCloseModal={() => setComparePlanModalOpen(false)}
                    contactData={contactData}
                    {...getComparePlansByPlanNamesProps()}
                />
            )}
            <div className={styles.comparePage}>
                <Media query={"(max-width: 500px)"} onChange={(isMobile) => {}} />
                <WithLoader isLoading={isLoading}>
                    <Helmet>
                        <title>Integrity - Plans</title>
                    </Helmet>
                    {!isComingFromEmail && <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.MEDICARE} />}
                    {!isComingFromEmail && (
                        <ContactProfileTabBar
                            contactId={id}
                            showTabs={false}
                            backButtonLabel={"Back"}
                            backButtonRoute={`/plans/${id}?preserveSelected=true`}
                            stickyHeader={true}
                        />
                    )}
                    <Box sx={{ padding: "56px 24px", pb: 0 }}>
                        <Box sx={{ pb: 3 }} display={"flex"} justifyContent={"center"}>
                            <Typography variant="h2" gutterBottom color={"#052a63"}>
                                {MEDICARE_ADVANTAGE}
                            </Typography>
                        </Box>
                    </Box>
                    {isNonRTS_User && <NonRTSBanner />}
                    {isComingFromEmail && (
                        <div className={styles["welcome-user-header"]}>
                            <Container>
                                <WelcomeEmailUser
                                    firstName={agentInfo.LeadFirstName}
                                    lastName={agentInfo.LeadLastName}
                                    className="welcome-user-plans"
                                />
                            </Container>
                        </div>
                    )}

                    <ComparePlansByPlanName {...getComparePlansByPlanNamesProps()} />
                    <Container>
                        {plansLoading ? (
                            <Spinner />
                        ) : (
                            <div className={styles["compare-plans-list"]}>
                                <PharmacyFilter type="select" />
                                <CostCompareTable
                                    plans={comparePlans}
                                    isFullYear={isFullYear}
                                    effectiveDate={effectiveDate}
                                />

                                <div style={{ height: 20 }} />
                                {pharmacies && pharmacies?.length > 0 && (
                                    <MailOrderNotApplicable
                                        mailOrderNotApplicable={mailOrderNotApplicable}
                                        pharmaciesList={pharmacies}
                                        contact={leadDetails}
                                        refresh={undefined}
                                        leadId={leadDetails.leadsId}
                                    />
                                )}

                                <div style={{ height: 20 }} />
                                <ProvidersCompareTable plans={comparePlans} />
                                <div style={{ height: 20 }} />
                                <PrescriptionsCompareTable
                                    plans={comparePlans}
                                    prescriptions={prescriptions}
                                    isFullYear={isFullYear}
                                    apiError={hasErrorPrescriptions}
                                />
                                <div style={{ height: 20 }} />
                                <PharmaciesCompareTable
                                    plans={comparePlans}
                                    pharmacies={pharmacies}
                                    apiError={hasErrorPharmacies}
                                />
                                <div style={{ height: 20 }} />
                                <PlanBenefitsCompareTable plans={comparePlans} pharmacies={pharmacies} />
                                <div style={{ height: 20 }} />

                                <PharmacyCoverageCompareTable plans={comparePlans} pharmacies={pharmacies} />
                                <div style={{ height: 20 }} />

                                <RetailPharmacyCoverage
                                    plans={comparePlans}
                                    pharmacies={pharmacies}
                                    header="Standard Retail Pharmacy Coverage"
                                    isPreffered={false}
                                    isRetail={true}
                                />
                                <div style={{ height: 20 }} />
                                <PlanDocumentsCompareTable plans={comparePlans} />
                                <div style={{ height: 20 }} />
                            </div>
                        )}
                    </Container>
                </WithLoader>
                {footer && <GlobalFooter />}
            </div>
        </>
    );
};

export default ComparePlansPage;
