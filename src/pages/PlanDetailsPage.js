import React, { useState, useRef } from "react";
import styles from "./PlanDetailsPage.module.scss";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { Button } from "components/ui/Button";
import ArrowDown from "components/icons/arrow-down";
import Media from "react-media";
import WithLoader from "components/ui/WithLoader";
import { Helmet } from "react-helmet-async";
import ScrollNav from "components/ui/ScrollNav";
import GlobalNav from "partials/global-nav-v2";
import Container from "components/ui/container";

const PlanDetailsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading /*, setIsLoading*/] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const costsRef = useRef(null);
  const providerDetailsRef = useRef(null);
  const prescriptionDetailsRef = useRef(null);
  const pharmacyDetailsRef = useRef(null);
  const planBenefitsRef = useRef(null);
  const outOfNetworkCoverageRef = useRef(null);
  const pharmacyCoverageRef = useRef(null);
  const oneMonthSupplyRef = useRef(null);
  const threeMonthSupplyRef = useRef(null);
  const planDocumentsRef = useRef(null);
  return (
    <React.Fragment>
      <ToastContextProvider>
        <div className={`${styles["plan-details-page"]}`}>
          <Media
            query={"(max-width: 500px)"}
            onChange={(isMobile) => {
              setIsMobile(isMobile);
            }}
          />
          <WithLoader isLoading={isLoading}>
            <Helmet>
              <title>MedicareCENTER - Plans</title>
            </Helmet>
            <GlobalNav />
            <div className={`${styles["header"]}`}>
              <Container>
                <div className={`${styles["back"]}`}>
                  <Button
                    icon={<ArrowDown />}
                    label="Back to Plans List"
                    onClick={() => console.log("click")}
                    type="tertiary"
                  />
                </div>
              </Container>
            </div>
            <Container className={`${styles["body"]}`}>
              <div className={`${styles["left"]}`}>
                <ScrollNav
                  initialSectionID="costs"
                  scrollToInitialSection={false}
                  inactive={activeSection !== "overview"}
                  onChange={() => setActiveSection("overview")}
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
                      id: "providerDetails",
                      label: "Provider Details",
                    },
                    {
                      id: "prescriptionDetails",
                      label: "Prescription Details",
                    },
                    {
                      id: "pharmacyDetails",
                      label: "Pharmacy Details",
                    },
                    {
                      header: "Plan Details",
                    },
                    {
                      id: "planBenefits",
                      label: "Plan Benefits",
                    },
                    {
                      id: "outOfNetworkCoverage",
                      label: "Out of Network Coverage",
                    },
                    {
                      id: "pharmacyCoverage",
                      label: "Pharmacy Coverage",
                    },
                    {
                      id: "oneMonthStandard",
                      label: "One Month Supply (Retail) Standard Pharmacy",
                    },
                    {
                      id: "threeMonthPreferred",
                      label:
                        "Three Month Supply (Mail-Order) Pharmacy with Preferred Cost Sharing",
                    },
                    {
                      id: "planDocuments",
                      label: "Plan Documents",
                    },
                  ]}
                  ref={{
                    costs: costsRef,
                    providerDetails: providerDetailsRef,
                    prescriptionDetails: prescriptionDetailsRef,
                    pharmacyDetails: pharmacyDetailsRef,
                    planBenefits: planBenefitsRef,
                    outOfNetworkCoverage: outOfNetworkCoverageRef,
                    pharmacyCoverage: pharmacyCoverageRef,
                    oneMonthStandard: oneMonthSupplyRef,
                    threeMonthPreferred: threeMonthSupplyRef,
                    planDocuments: planDocumentsRef,
                  }}
                />
              </div>
              <div className={`${styles["main"]}`}>
                <div ref={costsRef} className={`${styles["costs"]}`}>
                  costs section
                </div>
                <div
                  ref={providerDetailsRef}
                  className={`${styles["provider-details"]}`}
                >
                  provider details section
                </div>
                <div
                  ref={prescriptionDetailsRef}
                  className={`${styles["prescription-details"]}`}
                >
                  prescription details section
                </div>
                <div
                  ref={pharmacyDetailsRef}
                  className={`${styles["pharmacy-details"]}`}
                >
                  pharmacy details
                </div>
                <div
                  ref={planBenefitsRef}
                  className={`${styles["plan-benefits"]}`}
                >
                  plan benefits
                </div>
                <div
                  ref={outOfNetworkCoverageRef}
                  className={`${styles["out-of-network"]}`}
                >
                  out of network
                </div>
                <div
                  ref={pharmacyCoverageRef}
                  className={`${styles["pharmacy-coverage"]}`}
                >
                  pharmacy coverage
                </div>
                <div
                  ref={oneMonthSupplyRef}
                  className={`${styles["one-month"]}`}
                >
                  one month
                </div>
                <div
                  ref={threeMonthSupplyRef}
                  className={`${styles["three-month"]}`}
                >
                  three month
                </div>
                <div
                  ref={planDocumentsRef}
                  className={`${styles["plan-documents"]}`}
                >
                  plan documents
                </div>
              </div>
            </Container>
          </WithLoader>
        </div>
      </ToastContextProvider>
    </React.Fragment>
  );
};

export default PlanDetailsPage;
