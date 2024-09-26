import * as Sentry from "@sentry/react";
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useParams } from "react-router-dom";

import useRoles from "hooks/useRoles";
import useToast from "hooks/useToast";

import NonRTSBanner from "components/Non-RTS-Banner";
import CallScript from "components/icons/callScript";
import { BackToTop } from "components/ui/BackToTop";
import { Button } from "components/ui/Button";
import EnrollmentModal from "components/ui/Enrollment/enrollment-modal";
import SharePlanModal from "components/ui/SharePlan/sharePlan-modal";
import WithLoader from "components/ui/WithLoader";
import Container from "components/ui/container";

import ContactFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import MaContent from "partials/plan-details-content/ma";
import MapdContent from "partials/plan-details-content/mapd";
import PdpContent from "partials/plan-details-content/pdp";

import analyticsService from "services/analyticsService";
import { useClientServiceContext } from "services/clientServiceProvider";

import { useLeadDetails } from "providers/ContactDetails";

import styles from "./PlanDetailsPage.module.scss";

import { PLAN_TYPE_ENUMS } from "../constants";

import NewBackBtn from "images/new-back-btn.svg";
import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import { usePharmacyContext } from "providers/PharmacyProvider";

const PlanDetailsPage = () => {
    const showToast = useToast();
    const { contactId, planId, effectiveDate } = useParams();
    const { leadDetails } = useLeadDetails();

    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [contact, setContact] = useState(leadDetails);
    const [plan, setPlan] = useState();
    const [modalOpen, setModalOpen] = useState();
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const { isNonRTS_User } = useRoles();
    const { clientsService, plansService } = useClientServiceContext();
    const { pharmacies, fetchPharmacies, hasFetchedPharmacies } = useHealth() || {};
    const { selectedPharmacy } = usePharmacyContext();

    const getContactAndPlanData = useCallback(async () => {
        setIsLoading(true);
        try {
            const contactData = await clientsService.getContactInfo(contactId);

            const primaryPharmacy = pharmacies.length > 0 ? pharmacies?.find(pharmacy => pharmacy.isPrimary)?.pharmacyId : null;
            const pharmacyId = selectedPharmacy?.pharmacyId || primaryPharmacy;

            const planData = await plansService.getPlan(contactId, planId, contactData, effectiveDate, pharmacyId);

            if (!planData) {
                showToast({
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
            showToast({
                type: "error",
                message: "There was an error loading the plan.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [contactId, planId, showToast, effectiveDate, fetchPharmacies]);

    const getPharmacies = async () => {
        if (!hasFetchedPharmacies) await fetchPharmacies(contactId);
    }

    useEffect(() => {
        getPharmacies();
        getContactAndPlanData();
    }, [pharmacies]);

    return (
        <React.Fragment>
            <div className={`${styles["plan-details-page"]}`} style={isLoading ? { background: "#ffffff" } : {}}>
                <Media
                    query={"(max-width: 500px)"}
                    onChange={(isMobile) => {
                        setIsMobile(isMobile);
                    }}
                />

                <WithLoader isLoading={isLoading}>
                    <Helmet>
                        <title>Integrity - Plans</title>
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
                                contact={contact}
                                plan={plan}
                                styles={styles}
                                isMobile={isMobile}
                                onShareClick={() => setShareModalOpen(true)}
                                onEnrollClick={() => setModalOpen(true)}
                                refresh={getContactAndPlanData}
                                leadId={contactId}
                            />
                        )}
                        {plan && PLAN_TYPE_ENUMS[plan.planType] === "PDP" && (
                            <PdpContent
                                contact={contact}
                                plan={plan}
                                styles={styles}
                                isMobile={isMobile}
                                onShareClick={() => setShareModalOpen(true)}
                                onEnrollClick={() => setModalOpen(true)}
                                refresh={getContactAndPlanData}
                                leadId={contactId}
                            />
                        )}
                        {plan && PLAN_TYPE_ENUMS[plan.planType] === "MA" && (
                            <MaContent
                                plan={plan}
                                styles={styles}
                                isMobile={isMobile}
                                onShareClick={() => setShareModalOpen(true)}
                                onEnrollClick={() => setModalOpen(true)}
                                refresh={getContactAndPlanData}
                                leadId={contactId}
                            />
                        )}
                    </Container>
                    <ContactFooter />
                    <BackToTop />
                    {!isLoading && (
                        <>
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
                                effectiveDate={effectiveDate}
                            />
                        </>
                    )}
                </WithLoader>
            </div>
        </React.Fragment>
    );
};

export default PlanDetailsPage;
