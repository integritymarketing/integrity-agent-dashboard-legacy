import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  `${process.env.REACT_APP_ENROLLMENT_CONSUMER_API}/confirmationNumber/${confirmationNumber}`;

const EnrollmentHistoryPage = ({ agentInfo = {}, isComingFromEmail = false, footer = true }) => {
  const { contactId: propLeadId, EnrollData: propEnrollData, LeadFirstName, LeadLastName } = agentInfo;
  const { contactId : paramContactId, confirmationNumber  } = useParams();
  const location = useLocation();
  const addToast = useToast();
  const memoizedUrl = useMemo(() => API_URL(confirmationNumber), [confirmationNumber]);
  const { Get: fetchEnrollByConfirmationNumber } = useFetch(memoizedUrl, true);  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [contact, setContact] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const finalContactId = paramContactId || propLeadId;
  let plan_data = data?.medicareEnrollment?.planDetails;
  const isCurrentYear = (dateString) => {
    const inputDate = new Date(dateString);
    const inputYear = inputDate.getFullYear();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return inputYear === currentYear;
  };
  const buildEnrollData = useCallback((enrollData) => {
    if (!enrollData) {
      return {}; 
    }
    const lowerCasedEnrollData = Object.fromEntries(
      Object.entries(enrollData).map(([key, value]) => [key.charAt(0).toLowerCase() + key.slice(1), value])
    );
  
    return {
      ...lowerCasedEnrollData,
      currentYear: isCurrentYear(lowerCasedEnrollData?.policyEffectiveDate),
      policyHolder: `${LeadFirstName} ${LeadLastName}`,
      submittedDate: lowerCasedEnrollData?.appSubmitDate,
    };
  }, [LeadFirstName, LeadLastName]);
  const processedEnrollData = buildEnrollData(propEnrollData);
  const enrollData = location?.state?.state || processedEnrollData || {};

  useEffect(() => {
    const fetchData = async () => {
      if (confirmationNumber) {
        try {
          setLoading(true);
          const response = await fetchEnrollByConfirmationNumber();
          setdata(response);
          setLoading(false);
        } catch (error) {
          Sentry.captureException(error);
          setLoading(false);
          addToast({
            type: "error",
            message: "There was an error loading the enrollment details.",
          });
        }
      }
    };
  
    fetchData();
  }, [addToast, confirmationNumber, fetchEnrollByConfirmationNumber]);

  const getContactData = useCallback(async () => {
    try {
      const contactData = await clientsService.getContactInfo(finalContactId);

      setContact(contactData);
    } catch (e) {
      Sentry.captureException(e);
      addToast({
        type: "error",
        message: "There was an error loading the contact details.",
      });
    } finally {
    }
  }, [finalContactId, addToast]);

  useEffect(() => {
    if (!isComingFromEmail && finalContactId) {
      getContactData();
    }
  }, [getContactData, isComingFromEmail, finalContactId]);

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
            enrollData={enrollData}
          />
        )}
        <WithLoader isLoading={loading}>
          <Helmet>
            <title>MedicareCENTER - Enrollment History</title>
          </Helmet>
          <GlobalNav />
          {!isComingFromEmail && <GoBackNavbar />}
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
                //pharmacies={plan_data?.pharmacyCosts}
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
                //pharmacies={plan_data?.pharmacyCosts}
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
