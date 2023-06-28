import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import useToast from "hooks/useToast";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";

const API_URL = (confirmationNumber) =>
  `https://ae-api-dev.integritymarketinggroup.com/ae-enrollment-service/api/v1.0/Medicare/confirmationNumber/${confirmationNumber}`;

const EnrollmentHistoryPage = (props) => {
  const { contactId, confirmationNumber } = useParams();
  const location = useLocation();

  const { state: enrollData } = location.state;

  const { isComingFromEmail = false, footer = true } = props;

  const addToast = useToast();
  const { data, loading } = useFetch(API_URL(confirmationNumber));

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [contact, setContact] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  let plan_data = data?.medicareEnrollment?.planDetails;

  const getContactData = useCallback(async () => {
    try {
      const contactData = await clientsService.getContactInfo(contactId);

      setContact(contactData);
    } catch (e) {
      Sentry.captureException(e);
      addToast({
        type: "error",
        message: "There was an error loading the contact details.",
      });
    } finally {
    }
  }, [contactId, addToast]);

  useEffect(() => {
    if (!isComingFromEmail && contactId) {
      getContactData();
    }
  }, [getContactData, isComingFromEmail, contactId]);

  return (
    <>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <div className={styles.enrollmentHistory}>
        {shareModalOpen && !isComingFromEmail && (
          <SharePlanModal
            modalOpen={shareModalOpen}
            planData={plan_data}
            handleCloseModal={() => setShareModalOpen(false)}
            contact={contact}
            enrollmentId={data?.enrollmentId}
            ispolicyShare={true}
          />
        )}
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
                isEmail={isComingFromEmail}
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
                isEmail={isComingFromEmail}
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
                isEmail={isComingFromEmail}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => setShareModalOpen(true)}
              />
            )}
          </Container>
          {footer && <ContactFooter />}

          <BackToTop />
        </WithLoader>
      </div>
    </>
  );
};

export default EnrollmentHistoryPage;