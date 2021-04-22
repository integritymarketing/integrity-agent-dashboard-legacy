import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import Footer from "components/ui/Footer";
import GlobalNav from "partials/global-nav-v2";
import clientsService from "services/clientsService";
import styles from "../ContactsPage.module.scss";
import "./contactRecordInfo.scss";
import OverviewIcon from "components/icons/home";
import DetailsIcon from "components/icons/person";
import PreferencesIcon from "components/icons/settings";
import Activities from "./activity";
import Reminders from "./reminder";
import PersonalInfo from "./PersonalInfo";
import { useLocation } from "react-router-dom";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import * as Sentry from "@sentry/react";

export default () => {
  const { pathname = "" } = useLocation();
  const [personalInfo, setPersonalInfo] = useState({});
  const value = pathname.split("/");
  const id = value.length > 0 ? value[2] : "";
  useEffect(() => {
    clientsService
      .getContactInfo(id)
      .then((data) => {
        setPersonalInfo(data);
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  }, [id]);

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Contacts</title>
      </Helmet>
      <GlobalNav />
      <Container className={styles.container}>
        <ToastContextProvider>
          <p className={styles.header}>Contacts</p>
          <ul className="leftcardmenu">
            <li className="active">
              <label className="icon-spacing">
                <OverviewIcon />
              </label>
              <span>Overview</span>
            </li>
            <li>
              <label className="icon-spacing">
                <DetailsIcon />
              </label>
              <span>Details</span>
            </li>
            <li>
              <label className="icon-spacing">
                <PreferencesIcon />
              </label>
              <span>Preferences</span>
            </li>
          </ul>
          <div className="rightSection">
            <PersonalInfo personalInfo={personalInfo} />
            <Reminders />
            <Activities />
          </div>
        </ToastContextProvider>
      </Container>
      <Footer />
    </React.Fragment>
  );
};
