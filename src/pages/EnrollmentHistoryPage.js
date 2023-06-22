import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "hooks/useFetch";
import styles from "./EnrollmentHistoryPage.module.scss";
import WithLoader from "components/ui/WithLoader";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import Container from "components/ui/container";
import MapdContent from "partials/plan-details-content/mapd";
import MaContent from "partials/plan-details-content/ma";
import PdpContent from "partials/plan-details-content/pdp";
import { PLAN_TYPE_ENUMS } from "../constants";
import SharePlanModal from "components/ui/SharePlan/sharePlan-modal";
import { BackToTop } from "components/ui/BackToTop";
import ContactFooter from "partials/global-footer";
import GoBackNavbar from "components/BackButtonNavbar";
import Media from "react-media";

const enrollData = {
  agentNpn: "17138811",
  leadId: "2288457",
  policyNumber: "522914424",
  plan: "1jzrm179w3",
  carrier: null,
  policyStatus: "submitted",
  consumerSource: "Medicare Center",
  confirmationNumber: 123456,
  consumerFirstName: "arsenio",
  consumeLastName: "assin",
  policyEffectiveDate: "2020-03-18T00:00:00",
  appSubmitDate: "2023-02-18T00:00:00",
  hasPlanDetails: false,
};

const API_URL = (confirmationNumber) =>
  `https://ae-api-dev.integritymarketinggroup.com/ae-enrollment-service/api/v1.0/Medicare/confirmationNumber/${confirmationNumber}`;

const EnrollmentHistoryPage = () => {
  const { contactId, confirmationNumber } = useParams();
  const { data, loading, error } = useFetch(API_URL(confirmationNumber));
  // const { , loading, error } = useFetch(API_URL(confirmationNumber));

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  console.log("JJJ", contactId, data, error, confirmationNumber);
  let plan_data = data?.medicareEnrollment?.planDetails;

  // const getContactAndPlanData = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const [contactData, pharmacies] = await Promise.all([
  //       clientsService.getContactInfo(contactId),
  //       clientsService.getLeadPharmacies(contactId),
  //     ]);
  //     const planData = await plansService.getPlan(
  //       contactId,
  //       planId,
  //       contactData,
  //       effectiveDate
  //     );
  //     setPharmacies(
  //       pharmacies.reduce((dict, item) => {
  //         dict[item["pharmacyID"]] = item;
  //         return dict;
  //       }, {})
  //     );
  //     if (!planData) {
  //       addToast({
  //         type: "error",
  //         message: "There was an error loading the plan.",
  //       });
  //     }
  //     setPlan(planData);
  //     setContact(contactData);
  //     analyticsService.fireEvent("event-content-load", {
  //       pagePath: "/:contactId/plan/:planId",
  //     });
  //   } catch (e) {
  //     Sentry.captureException(e);
  //     addToast({
  //       type: "error",
  //       message: "There was an error loading the plan.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [contactId, planId, addToast, effectiveDate]);

  return (
    <>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <div className={styles.enrollmentHistory}>
        <SharePlanModal
          modalOpen={shareModalOpen}
          planData={plan_data}
          handleCloseModal={() => setShareModalOpen(false)}
        />
        <WithLoader isLoading={loading}>
          <Helmet>
            <title>MedicareCENTER - Enrollment History</title>
          </Helmet>
          <GlobalNav />
          <GoBackNavbar />
          <Container className={styles.body}>
            {plan_data && PLAN_TYPE_ENUMS[plan_data.planType] === "MAPD" && (
              <MapdContent
                plan={plan_data}
                enrollData={enrollData}
                isEnroll={true}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => setShareModalOpen(true)}
                pharmacies={plan_data?.pharmacyCosts}
              />
            )}
            {plan_data && PLAN_TYPE_ENUMS[plan_data.planType] === "PDP" && (
              <PdpContent
                plan={plan_data}
                enrollData={enrollData}
                isEnroll={true}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => setShareModalOpen(true)}
                pharmacies={plan_data?.pharmacyCosts}
              />
            )}
            {plan_data && PLAN_TYPE_ENUMS[plan_data.planType] === "MA" && (
              <MaContent
                plan={plan_data}
                enrollData={enrollData}
                isEnroll={true}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => setShareModalOpen(true)}
              />
            )}
          </Container>
          <ContactFooter />
          <BackToTop />
        </WithLoader>
      </div>
    </>
  );
};

export default EnrollmentHistoryPage;
