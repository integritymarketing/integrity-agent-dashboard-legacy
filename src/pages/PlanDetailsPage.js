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

const PlanDetailsPage = () => {
  const history = useHistory();
  const addToast = useToast();
  const { contactId, planId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState();
  const [contact, setContact] = useState();
  const [plan, setPlan] = useState();

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
        contactData
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
    } catch (e) {
      Sentry.captureException(e);
      addToast({
        type: "error",
        message: "There was an error loading the plan.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [contactId, planId, addToast]);

  const enroll = useCallback(async () => {
    try {
      const enrolled = await plansService.enroll(contactId, planId, {
        firstName: contact.firstName,
        middleInitial:
          contact.middleName.length > 1 ? contact.middleName[0] : "",
        lastName: contact.lastName,
        address1: contact.addresses[0].address1,
        address2: contact.addresses[0].address2,
        city: contact.addresses[0].city,
        state: contact.addresses[0].state,
        zip: contact.addresses[0].postalCode,
        countyFIPS: contact.addresses[0].countyFips,
        phoneNumber: contact.phones[0].leadPhone,
        email: contact.emails[0].leadEmail,
      });

      if (enrolled && enrolled.url) {
        addToast({
          type: "success",
          message: "Successfully Enrolled",
        });
        window.open(enrolled.url, "_blank").focus();
      } else {
        addToast({
          type: "error",
          message: "There was an error enrolling the contact.",
        });
      }
    } catch (e) {
      Sentry.captureException(e);
    }
  }, [contactId, planId, contact, addToast]);

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
                    onClick={() => history.push(`/plans/${contactId}`)}
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
                  onEnrollClick={enroll}
                  pharmacies={pharmacies}
                />
              )}
              {plan && PLAN_TYPE_ENUMS[plan.planType] === "PDP" && (
                <PdpContent
                  plan={plan}
                  styles={styles}
                  isMobile={isMobile}
                  onEnrollClick={enroll}
                  pharmacies={pharmacies}
                />
              )}
              {plan && PLAN_TYPE_ENUMS[plan.planType] === "MA" && (
                <MaContent
                  plan={plan}
                  styles={styles}
                  isMobile={isMobile}
                  onEnrollClick={enroll}
                />
              )}
            </Container>
          </WithLoader>
        </div>
      </ToastContextProvider>
    </React.Fragment>
  );
};

export default PlanDetailsPage;
