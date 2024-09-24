import * as Sentry from "@sentry/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useParams } from "react-router-dom";

import ArrowDown from "components/icons/arrow-down";
import { Button } from "components/ui/Button";
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

import GlobalNav from "partials/global-nav-v2";

import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";

import styles from "./PlansPage.module.scss";
import Heading1 from "packages/Heading1";

export default (props) => {
    const { contactId: id, planIds: comparePlanIds, effectiveDate } = useParams();
    const { isComingFromEmail, agentInfo = {} } = props;
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
    const { clientsService, comparePlansService, plansService } = useClientServiceContext();

    function getAllPlanDetails({
        planIds,
        contactId,
        contactData,
        effectiveDate,
        isComingFromEmail,
        agentNPN,
        agentInfo,
    }) {
        const primaryPharmacy = pharmacies.length > 0 ? pharmacies.find(pharmacy => pharmacy.isPrimary)?.pharmacyId : null;
        return Promise.all(
            planIds
                .filter(Boolean)
                .map((planId) =>
                    !isComingFromEmail
                        ? plansService.getPlan(contactId, planId, contactData, effectiveDate, primaryPharmacy)
                        : comparePlansService.getPlan(contactId, planId, agentInfo, effectiveDate, agentNPN, primaryPharmacy),
                ),
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

            const [prescriptionData, pharmacyData] = !isComingFromEmail
                ? await Promise.all([clientsService.getLeadPrescriptions(id), clientsService.getLeadPharmacies(id)])
                : await Promise.all([
                      comparePlansService.getLeadPrescriptions(id, agentInfo?.AgentNpn),
                      comparePlansService.getLeadPharmacies(id, agentInfo?.AgentNpn),
                  ]);
            setPrescriptions(prescriptionData);
            setPharmacies(pharmacyData || []);
            analyticsService.fireEvent("event-content-load", {
                pagePath: "/plans/:contactId",
            });
        } catch (e) {
            Sentry.captureException(e);
        } finally {
            setLoading(false);
        }
    }, [effectiveDate, id, planIds, isComingFromEmail]);

    useEffect(() => {
        if (results && results.length) {
            setComparePlans(results.filter(({ id }) => planIds.includes(id)));
        }
    }, [planIds, results]);

    useEffect(() => {
        getContactRecordInfo();
    }, [getContactRecordInfo]);

    const handleRemovePlan = (planId) => {
        setComparePlans((prevPlans) => {
            const plansUpdated = prevPlans.filter((plan) => plan.id !== planId);
            const jsonStr = sessionStorage.getItem("__plans__");
            const parseStr = jsonStr ? JSON.parse(jsonStr) : {};
            sessionStorage.setItem("__plans__", JSON.stringify({ ...parseStr, plans: plansUpdated }));

            return plansUpdated;
        });
    };

    const getComparePlansByPlanNamesProps = () => {
        return {
            comparePlans,
            isEmail: isComingFromEmail,
            setComparePlanModalOpen,
            handleRemovePlan,
            id,
            plansLoading,
        };
    };

    const isLoading = loading;

    if (loading) {
        return <Spinner />;
    }
    return (
        <>
            <ComparePlanModal
                modalOpen={comparePlanModalOpen}
                handleCloseModal={() => setComparePlanModalOpen(false)}
                contactData={contactData}
                {...getComparePlansByPlanNamesProps()}
            />
            <div className={styles.comparePage}>
                <Media query={"(max-width: 500px)"} onChange={(isMobile) => {}} />
                <WithLoader isLoading={isLoading}>
                    <Helmet>
                        <title>Integrity - Plans</title>
                    </Helmet>
                    <GlobalNav />
                    <div className={`${styles["header"]}`} style={{ height: "auto" }}>
                        <Container>
                            <div className={styles["back-btn"]}>
                                <Button
                                    icon={<ArrowDown />}
                                    label="Back to Plans List"
                                    onClick={() => {
                                        window.location = `/plans/${id}?preserveSelected=true`;
                                    }}
                                    type="tertiary"
                                />
                            </div>
                        </Container>
                    </div>
                    <ComparePlansByPlanName {...getComparePlansByPlanNamesProps()} />
                    <Container>
                        {plansLoading ? (
                            <Spinner />
                        ) : (
                            <div className={styles["compare-plans-list"]}>
                                <h1>Test!!!</h1>
                                <CostCompareTable
                                    plans={comparePlans}
                                    isFullYear={isFullYear}
                                    effectiveDate={effectiveDate}
                                />
                                <div style={{ height: 20 }} />
                                <ProvidersCompareTable plans={comparePlans} />
                                <div style={{ height: 20 }} />
                                <PrescriptionsCompareTable
                                    plans={comparePlans}
                                    prescriptions={prescriptions}
                                    isFullYear={isFullYear}
                                />
                                <div style={{ height: 20 }} />
                                <PharmaciesCompareTable plans={comparePlans} pharmacies={pharmacies} />
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
                            </div>
                        )}
                    </Container>
                </WithLoader>
            </div>
        </>
    );
};
