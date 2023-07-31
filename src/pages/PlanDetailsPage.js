import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import styles from "./PlanDetailsPage.module.scss";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { Button } from "components/ui/Button";
import NewBackBtn from "images/new-back-btn.svg";
import Media from "react-media";
import WithLoader from "components/ui/WithLoader";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import Container from "components/ui/container";
import clientsService from "services/clientsService";
import plansService from "services/plansService";
import MapdContent from "partials/plan-details-content/mapd";
import MaContent from "partials/plan-details-content/ma";
import PdpContent from "partials/plan-details-content/pdp";
import { PLAN_TYPE_ENUMS } from "../constants";
import EnrollmentModal from "components/ui/Enrollment/enrollment-modal";
import SharePlanModal from "components/ui/SharePlan/sharePlan-modal";
import analyticsService from "services/analyticsService";
import { BackToTop } from "components/ui/BackToTop";
import ContactFooter from "partials/global-footer";
import NonRTSBanner from "components/Non-RTS-Banner";
import useRoles from "hooks/useRoles";
import CallScript from "components/icons/callScript";

const PlanDetailsPage = () => {
  const addToast = useToast();
  const { contactId, planId, effectiveDate } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState();
  const [pharmaciesList, setPharmaciesList] = useState();

  const [contact, setContact] = useState();
  const [plan, setPlan] = useState();
  const [modalOpen, setModalOpen] = useState();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const { isNonRTS_User } = useRoles();

  const getContactAndPlanData = useCallback(async () => {
    setIsLoading(true);
    try {
      let [contactData, pharmacies] = await Promise.all([
        clientsService.getContactInfo(contactId),
        clientsService.getLeadPharmacies(contactId),
      ]);
      const planData = await plansService.getPlan(
        contactId,
        planId,
        contactData,
        effectiveDate
      );
      setPharmacies(
        pharmacies.reduce((dict, item) => {
          dict[item["pharmacyID"]] = item;
          return dict;
        }, {})
      );
      setPharmaciesList(pharmacies);
      if (!planData) {
        addToast({
          type: "error",
          message: "There was an error loading the plan.",
        });
      }
      setPlan(planData);
      setContact(contactData);
      analyticsService.fireEvent("event-content-load", {
        pagePath: "/:contactId/plan/:planId",
      });
    } catch (e) {
      Sentry.captureException(e);
      addToast({
        type: "error",
        message: "There was an error loading the plan.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [contactId, planId, addToast, effectiveDate]);

  useEffect(() => {
    getContactAndPlanData();
  }, [getContactAndPlanData]);

  return (
    <React.Fragment>
      <ToastContextProvider>
        <div className={`${styles["plan-details-page"]}`} style={isLoading? { background: '#ffffff' }: {}}>
          <Media
            query={"(max-width: 500px)"}
            onChange={(isMobile) => {
              setIsMobile(isMobile);
            }}
          />
          <EnrollmentModal
            modalOpen={modalOpen}
            planData={plan}
            contact={contact}
            handleCloseModal={() => setModalOpen(false)}
            effectiveDate={effectiveDate}
          />
          <SharePlanModal
            modalOpen={shareModalOpen}
            planData={plan}
            contact={contact}
            handleCloseModal={() => setShareModalOpen(false)}
          />
          <WithLoader isLoading={isLoading}>
            <Helmet>
              <title>MedicareCENTER - Plans</title>
            </Helmet>
            <GlobalNav />

            <div className={`${styles["header"]}`} style={{ height: "auto" }}>
              <Container className={`${styles["plan-details-container"]}`}>
                <div className={`${styles["back"]}`}>
                  <Button
                    icon={<img src={NewBackBtn} alt="Back" />}
                    label={isMobile ? "Back" : "Back to Plans"}
                    onClick={() => {
                      window.location = `/plans/${contactId}?preserveSelected=true`;
                    }}
                    type="tertiary"
                    className={`${styles["back-button"]}`}
                  />
                </div>
                <p className={`${styles["header-text"]}`}>Plan Details</p>
                <p className={`${styles["header-callscript"]}`}>{isMobile ? <CallScript /> : null}</p>
              </Container>
            </div>

            {isNonRTS_User && <NonRTSBanner />}

            <Container className={`${styles["body"]}`}>
              {plan && PLAN_TYPE_ENUMS[plan.planType] === "MAPD" && (
                <MapdContent
                  plan={plan}
                  styles={styles}
                  isMobile={isMobile}
                  onShareClick={() => setShareModalOpen(true)}
                  onEnrollClick={() => setModalOpen(true)}
                  pharmacies={pharmacies}
                  pharmaciesList={pharmaciesList}
                />
              )}
              {plan && PLAN_TYPE_ENUMS[plan.planType] === "PDP" && (
                <PdpContent
                  plan={plan}
                  styles={styles}
                  isMobile={isMobile}
                  onShareClick={() => setShareModalOpen(true)}
                  onEnrollClick={() => setModalOpen(true)}
                  pharmacies={pharmacies}
                  pharmaciesList={pharmaciesList}
                />
              )}
              {plan && PLAN_TYPE_ENUMS[plan.planType] === "MA" && (
                <MaContent
                  plan={plan}
                  styles={styles}
                  isMobile={isMobile}
                  onShareClick={() => setShareModalOpen(true)}
                  onEnrollClick={() => setModalOpen(true)}
                />
              )}
            </Container>
            <ContactFooter />
            <BackToTop />
          </WithLoader>
        </div>
      </ToastContextProvider>
    </React.Fragment>
  );
};

export default PlanDetailsPage;
