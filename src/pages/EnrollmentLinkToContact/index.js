import * as Sentry from "@sentry/react";
import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Helmet } from "react-helmet-async";
import ContactSearch from "pages/LinkToContact/ContactSearch";
import clientsService from "services/clientsService";
import { useHistory, useParams } from "react-router-dom";
import CreateNewContact from "pages/LinkToContact/CreateNewContact";

export default function EnrollmentLinkToContact() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { callLogId, callFrom } = useParams();

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
      <div className={styles.contactsContainer}>
        <div className={styles.medContent}>
          <CreateNewContact goToAddNewContactsPage={goToAddNewContactsPage} />
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
      <Footer />
    </>
  );
}
