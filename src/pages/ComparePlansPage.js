import React, { useCallback, useEffect, useState, useMemo } from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { Button } from "components/ui/Button";
import ArrowDown from "components/icons/arrow-down";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import Container from "components/ui/container";
import clientsService from "services/clientsService";
import WithLoader from "components/ui/WithLoader";
import styles from "./PlansPage.module.scss";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import analyticsService from "services/analyticsService";
import { CostCompareTable } from "components/ui/PlanDetailsTable/shared/cost-table";
import { ProvidersCompareTable } from "components/ui/PlanDetailsTable/shared/providers-compare-table";
import Spinner from "components/ui/Spinner/index";
import { PrescriptionsCompareTable } from "components/ui/PlanDetailsTable/shared/prescriptions-compare-table";
import { PlanDocumentsCompareTable } from "components/ui/PlanDetailsTable/shared/plan-documents-compare-table";
import { PharmaciesCompareTable } from "components/ui/PlanDetailsTable/shared/pharmacies-compare-table";
import { PlanBenefitsCompareTable } from "components/ui/PlanDetailsTable/shared/plan-benefits-compare-table";
import { PharmacyCoverageCompareTable } from "components/ui/PlanDetailsTable/shared/pharmacy-coverage-compare-table";
import ComparePlanModal from "components/ui/ComparePlanModal";
import ComparePlansByPlanName from "components/ui/ComparePlansByPlanName";
import { RetailPharmacyCoverage } from "components/ui/PlanDetailsTable/shared/retail-pharmacy-coverage-compare-table";
import plansService from "services/plansService";
import WelcomeEmailUser from "partials/welcome-email-user";
import ComparePlansService from "services/comparePlansService";

function getAllPlanDetails({
  planIds,
  contactId,
  contactData,
  effectiveDate,
  isComingFromEmail,
  agentNPN,
  agentInfo,
}) {
  return Promise.all(
    planIds
      .filter(Boolean)
      .map((planId) =>
        !isComingFromEmail
          ? plansService.getPlan(contactId, planId, contactData, effectiveDate)
          : ComparePlansService.getPlan(
              contactId,
              planId,
              agentInfo,
              effectiveDate,
              agentNPN
            )
      )
  );
}

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
        ? await Promise.all([
            clientsService.getLeadPrescriptions(id),
            clientsService.getLeadPharmacies(id),
          ])
        : await Promise.all([
            ComparePlansService.getLeadPrescriptions(id, agentInfo?.AgentNpn),
            ComparePlansService.getLeadPharmacies(id, agentInfo?.AgentNpn),
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
    // eslint-disable-next-line
  }, [effectiveDate, id, planIds, isComingFromEmail]);

  useEffect(() => {
    if (results && results.length) {
      setComparePlans(results?.filter(({ id }) => planIds.includes(id)));
    }
  }, [planIds, results]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  const handleRemovePlan = (planId) => {
    setComparePlans((prevPlans) => {
      const plans = prevPlans?.filter((plan) => plan.id !== planId);

      sessionStorage.setItem(
        "__plans__",
        JSON.stringify({ plans, effectiveDate })
      );

      return plans;
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
    };
  };

  const isLoading = loading;

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <ToastContextProvider>
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
              <title>MedicareCENTER - Plans</title>
            </Helmet>
            {!isComingFromEmail && <GlobalNav />}
            {!isComingFromEmail && (
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
            )}
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
                  <PharmaciesCompareTable
                    plans={comparePlans}
                    pharmacies={pharmacies}
                  />
                  <div style={{ height: 20 }} />

                  <PlanBenefitsCompareTable
                    plans={comparePlans}
                    pharmacies={pharmacies}
                  />
                  <div style={{ height: 20 }} />

                  <PharmacyCoverageCompareTable
                    plans={comparePlans}
                    pharmacies={pharmacies}
                  />
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
          <GlobalFooter />
        </div>
      </ToastContextProvider>
    </>
  );
};
