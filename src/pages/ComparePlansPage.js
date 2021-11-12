import React, { useCallback, useEffect, useState, useMemo } from "react";
import * as Sentry from "@sentry/react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { Button } from "components/ui/Button";
import ArrowDown from "components/icons/arrow-down";
import GlobalNav from "partials/global-nav-v2";
import Container from "components/ui/container";
import clientsService from "services/clientsService";
import WithLoader from "components/ui/WithLoader";
import styles from "./PlansPage.module.scss";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import analyticsService from "services/analyticsService";
import { CostCompareTable } from "components/ui/PlanDetailsTable/shared/cost-table";
import { ProvidersCompareTable } from "components/ui/PlanDetailsTable/shared/providers-compare-table";
import Spinner from "./../components/ui/Spinner/index";
import { PrescriptionsCompareTable } from "./../components/ui/PlanDetailsTable/shared/prescriptions-compare-table";
import { PlanDocumentsCompareTable } from "./../components/ui/PlanDetailsTable/shared/plan-documents-compare-table";
import { PharmaciesCompareTable } from "./../components/ui/PlanDetailsTable/shared/pharmacies-compare-table";
import { PlanBenefitsCompareTable } from "./../components/ui/PlanDetailsTable/shared/plan-benefits-compare-table";
import { PharmacyCoverageCompareTable } from "./../components/ui/PlanDetailsTable/shared/pharmacy-coverage-compare-table";
import { RetailPharmacyCoverage } from "./../components/ui/PlanDetailsTable/shared/retail-pharmacy-coverage-compare-table";

export default () => {
  const { contactId: id, planIds: comparePlanIds } = useParams();
  const planIds = useMemo(() => comparePlanIds.split(","), [comparePlanIds]);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [plansLoading] = useState(false);

  const [results, setResults] = useState([]);
  const [comparePlans, setComparePlans] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const getContactRecordInfo = useCallback(async () => {
    setLoading(true);
    try {
      setResults([]);
      const plans = sessionStorage.getItem("__plans__");
      const plansData = plans ? JSON.parse(plans) : [];
      setResults(plansData);

      const [prescriptionData, pharmacyData] = await Promise.all([
        clientsService.getLeadPrescriptions(id),
        clientsService.getLeadPharmacies(id),
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
  }, [id]);

  useEffect(() => {
    if (results && results.length) {
      setComparePlans(results.filter(({ id }) => planIds.includes(id)));
    }
  }, [planIds, results]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  const isLoading = loading;
  const LOGO_BASE_URL =
    "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <ToastContextProvider>
        <div className={styles.comparePage}>
          <Media
            query={"(max-width: 500px)"}
            onChange={(isMobile) => {
            }}
          />
          <WithLoader isLoading={isLoading}>
            <Helmet>
              <title>MedicareCENTER - Plans</title>
            </Helmet>
            <GlobalNav />
            <div className={`${styles["header"]}`} style={{ height: "auto" }}>
              <Container>
                <div className={styles["back-btn"]}>
                  <Button
                    icon={<ArrowDown />}
                    label="Back to Plans List"
                    onClick={() => {
                      history.push({
                        pathname: `/plans/${id}`,
                      });
                    }}
                    type="tertiary"
                  />
                </div>
              </Container>
            </div>
            <div
              className={`${styles["plan-comparsion-heder"]} ${
                plansLoading && styles["display-initial"]
              }`}
            >
              {comparePlans.length > 0 && (
                <>
                  <div className={`${styles["plan-div"]}`}>
                    <span className={styles["comp-mr-left"]}>
                      Compare Plans
                    </span>
                    <span className={`${styles["plan-seperator"]}`}></span>
                  </div>
                  {comparePlans.map((plan) => (
                    <div className={`${styles["plan-div"]}`}>
                      <div className={styles["comp-mr-left"]}>
                        <div>
                          {" "}
                          <img
                            src={LOGO_BASE_URL + plan.logoURL}
                            alt="logo"
                            className={styles["plan-img"]}
                          />
                        </div>
                        <div className={styles["comp-plan-name"]}>
                          {plan && plan.planName}
                        </div>
                        <div className={styles["comp-plan-amnt"]}>
                          <span className={styles["value"]}>
                            {currencyFormatter.format(
                              plan.annualPlanPremium / 12
                            )}
                            <span className={styles["per"]}> / month</span>
                          </span>
                        </div>
                        <Button label="Enroll" type="primary" />
                      </div>
                      <div className={`${styles["plan-seperator"]}`}></div>
                    </div>
                  ))}
                  {comparePlans.length === 2 && (
                    <div className={`${styles["plan-div"]}`}>
                      <span className={styles["retrun-txt"]}>
                        Retun to plans list to add 3rd plan for comparsion.
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <Container>
              {plansLoading ? (
                <Spinner />
              ) : (
                <div className={styles["compare-plans-list"]}>
                  <CostCompareTable plans={comparePlans} />
                  <div style={{ height: 20 }} />
                  <ProvidersCompareTable plans={comparePlans} />
                  <div style={{ height: 20 }} />
                  <PrescriptionsCompareTable
                    plans={comparePlans}
                    prescriptions={prescriptions}
                  />
                  <div style={{ height: 20 }} />
                  <PlanDocumentsCompareTable plans={comparePlans} />
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
                </div>
              )}
            </Container>
          </WithLoader>
        </div>
      </ToastContextProvider>
    </>
  );
};
