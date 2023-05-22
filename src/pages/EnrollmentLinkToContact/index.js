import * as Sentry from "@sentry/react";
import ContactSearch from "./ContactSearch";
import DashboardHeaderSection from "pages/dashbaord/DashboardHeaderSection";
import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import Heading3 from "packages/Heading3";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams, useLocation } from "react-router-dom";
import PossibleMatches from "./PossibleMatches";
import CreateNewContact from "./CreateNewContact";
import clientsService from "services/clientsService";
import EnrollmentPlanCard from "components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard";
import GoBackNavbar from "components/BackButtonNavbar";

export default function EnrollmentLinkToContact() {
  const history = useHistory();
  const location = useLocation();
  const { state } = location.state;
  const { callLogId, callFrom } = useParams();

  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getContacts = async (searchStr) => {
    setIsLoading(true);
    try {
      const response = await clientsService.getList(
        undefined,
        undefined,
        ["Activities.CreateDate:desc"],
        searchStr
      );
      if (response && response.result) {
        setContacts(response.result);
      }
      // setIsLoading(false);
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  };
  const bannerContent = () => {
    return (
      <>
        <Heading3 text="Link to contacts" />
      </>
    );
  };

  const goToAddNewContactsPage = () => {
    history.push(
      `/contact/add-new/${callLogId}${callFrom ? "?callFrom=" + callFrom : ""}`,
      { state: state }
    );
  };

  const handleBackToRoute = () => {
    history.push(`/contact/${state?.leadId}/details`);
  };

  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Enrollment Link to Contact</title>
      </Helmet>
      <GlobalNav />
      <GoBackNavbar
        title="Back to Contacts Details"
        handleBackToRoute={handleBackToRoute}
      />
      <DashboardHeaderSection
        content={bannerContent()}
        justifyContent={"space-between"}
        padding={"0 10%"}
        className={styles.headerSection}
      />
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <EnrollmentPlanCard
            key={state.policyId}
            currentYear={state.currentYear}
            submittedDate={state.submittedDate || "12/05/2022"}
            enrolledDate={state.enrolledDate || "11/12/22"}
            effectiveDate={state.effectiveDate || "01/11/23"}
            policyId={state.policyId}
            policyHolder={state.policyHolder}
            leadId={state.leadId}
            planId={state.planId}
          />

          <div className={styles.contactsContainer}>
            <PossibleMatches
              phone={callFrom}
              policyHolder={state.policyHolder}
              state={state}
            />

            <div className={styles.medContent}>
              <CreateNewContact
                goToAddNewContactsPage={goToAddNewContactsPage}
              />
            </div>
            <div className={styles.medContent}>
              <div className={styles.container}>
                <ContactSearch
                  isLoading={isLoading}
                  onChange={getContacts}
                  contacts={contacts}
                  state={state}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
