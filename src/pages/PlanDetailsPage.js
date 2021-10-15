import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import styles from "./PlanDetailsPage.module.scss";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import { Button } from "components/ui/Button";
import ArrowDown from "components/icons/arrow-down";
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

const PlanDetailsPage = () => {
  const history = useHistory();
  const addToast = useToast();
  const { contactId, planId, effectiveDate } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState();
  const [contact, setContact] = useState();
  const [plan, setPlan] = useState();
  const [modalOpen, setModalOpen] = useState();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const getContactAndPlanData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [contactData, pharmacies] = await Promise.all([
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
        <div className={`${styles["plan-details-page"]}`}>
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
            <div className={`${styles["header"]}`}>
              <Container>
                <div className={`${styles["back"]}`}>
                  <Button
                    icon={<ArrowDown />}
                    label="Back to Plans List"
                    onClick={() => {
                      history.push({
                        pathname: `/plans/${contactId}`,
                        state: { planType: plan?.planType },
                      });
                    }}
                    type="tertiary"
                  />
                </div>
              </Container>
            </div>
            <Container className={`${styles["body"]}`}>
              {plan && PLAN_TYPE_ENUMS[plan.planType] === "MAPD" && (
                <MapdContent
                  plan={plan}
                  styles={styles}
                  isMobile={isMobile}
                  onShareClick={() => setShareModalOpen(true)}
                  onEnrollClick={() => setModalOpen(true)}
                  pharmacies={pharmacies}
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
            <BackToTop />
          </WithLoader>
        </div>
      </ToastContextProvider>
    </React.Fragment>
  );
};

export default PlanDetailsPage;
