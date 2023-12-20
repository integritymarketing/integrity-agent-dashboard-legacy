import React, { useCallback, useEffect, useState, useMemo } from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { Button } from "components/ui/Button";
import NewBackBtn from "images/new-back-btn.svg";
import GlobalNav from "partials/global-nav-v2";
import Footer from "components/Footer";
import Container from "components/ui/container";
import comparePlansService from "services/comparePlansService";
import plansService from "services/plansService";
import clientsService from "services/clientsService";
import WithLoader from "components/ui/WithLoader";
import styles from "./PlansPage.module.scss";
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
import WelcomeEmailUser from "partials/welcome-email-user";
import NonRTSBanner from "components/Non-RTS-Banner";
import useRoles from "hooks/useRoles";

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
    return Promise.all(
      planIds
        .filter(Boolean)
        .map((planId) =>
          !isComingFromEmail
            ? plansService.getPlan(contactId, planId, contactData, effectiveDate)
            : comparePlansService.getPlan(contactId, planId, agentInfo, effectiveDate, agentNPN)
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
    }
  }, [planIds, results]);

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
        <Media query={"(max-width: 500px)"} onChange={(isMobile) => { }} />
        <WithLoader isLoading={isLoading}>
          <Helmet>
            <title>Integrity Clients - Plans</title>
          </Helmet>
          {!isComingFromEmail && <GlobalNav />}
          {!isComingFromEmail && (
            <div className={`${styles["header"]}`} style={{ height: "auto" }}>
              <Container>
                <div className={styles["back-btn"]}>
                  <Button
                    icon={<img src={NewBackBtn} alt="Back" />}
                    label="Back to Plans List"
                    onClick={() => {
                      window.location = `/plans/${id}?preserveSelected=true`;
                    }}
                    type="tertiary"
                    className={`${styles["back-button"]}`}
                  />
                </div>
              </Container>
            </div>
          )}
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
