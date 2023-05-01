import * as Sentry from "@sentry/react";
import ContactSearch from "./ContactSearch";
import DashboardHeaderSection from "pages/dashbaord/DashboardHeaderSection";
import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import Heading3 from "packages/Heading3";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams } from "react-router-dom";
import PossibleMatches from "./PossibleMatches";
import CreateNewContact from "./CreateNewContact";
import clientsService from "services/clientsService";
import EnrollmentPlanCard from "components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard";
import GoBackNavbar from "components/BackButtonNavbar";

export default function EnrollmentLinkToContact() {
  const history = useHistory();
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
      setIsLoading(false);
      if (response && response.result) {
        setContacts(response.result);
      }
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
      `/contact/add-new/${callLogId}${callFrom ? "?callFrom=" + callFrom : ""}`
    );
  };

  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Enrollment Link to Contact</title>
      </Helmet>
      <GlobalNav />
      <GoBackNavbar title="Back to Contacts Details" />
      <DashboardHeaderSection
        content={bannerContent()}
        justifyContent={"space-between"}
        padding={"0 10%"}
        className={styles.headerSection}
      />
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <EnrollmentPlanCard />
          <PossibleMatches phone={callFrom} />
          <div className={styles.contactsContainer}>
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
