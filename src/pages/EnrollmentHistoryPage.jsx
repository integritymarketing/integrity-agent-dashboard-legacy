import * as Sentry from "@sentry/react";
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useLocation, useParams } from "react-router-dom";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";

import GoBackNavbar from "components/BackButtonNavbar";
import { BackToTop } from "components/ui/BackToTop";
import SharePlanModal from "components/ui/SharePlan/sharePlan-modal";
import WithLoader from "components/ui/WithLoader";
import Container from "components/ui/container";

import ContactFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import MaContent from "partials/plan-details-content/ma";
import MapdContent from "partials/plan-details-content/mapd";
import PdpContent from "partials/plan-details-content/pdp";

import { useClientServiceContext } from "services/clientServiceProvider";
import styles from "./EnrollmentHistoryPage.module.scss";

import { PLAN_TYPE_ENUMS } from "../constants";

const EnrollmentHistoryPage = ({ agentInfo = {}, isComingFromEmail = false, footer = true }) => {
    const { contactId: propLeadId, EnrollData: propEnrollData, LeadFirstName, LeadLastName } = agentInfo;
    const { contactId: paramContactId, confirmationNumber } = useParams();
    const location = useLocation();
    const showToast = useToast();
    const { Get: fetchEnrollByConfirmationNumber } = useFetch(
        `${import.meta.env.VITE_ENROLLMENT_CONSUMER_API}/confirmationNumber/${confirmationNumber}`,
        true
    );
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [contact, setContact] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [data, setdata] = useState(null);
    const [loading, setLoading] = useState(false);
    const { clientsService } = useClientServiceContext();
    const finalContactId = paramContactId || propLeadId;
    const plan_data = data?.medicareEnrollment?.planDetails;
    const isCurrentYear = (dateString) => {
        const inputDate = new Date(dateString);
        const inputYear = inputDate.getFullYear();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        return inputYear === currentYear;
    };
    const buildEnrollData = useCallback(
        (enrollData) => {
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
        },
        [LeadFirstName, LeadLastName]
    );
    const processedEnrollData = buildEnrollData(propEnrollData);
    const enrollData = location?.state || processedEnrollData || {};

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
                    showToast({
                        type: "error",
                        message: "There was an error loading the enrollment details.",
                    });
                }
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast, confirmationNumber]);

    const getContactData = useCallback(async () => {
        try {
            const contactData = await clientsService.getContactInfo(finalContactId);

            setContact(contactData);
        } catch (e) {
            Sentry.captureException(e);
            showToast({
                type: "error",
                message: "There was an error loading the contact details.",
            });
        }
    }, [clientsService, finalContactId, showToast]);

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
                        <title>Integrity - Enrollment History</title>
                    </Helmet>
                    {!isComingFromEmail && <GlobalNav />}
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
