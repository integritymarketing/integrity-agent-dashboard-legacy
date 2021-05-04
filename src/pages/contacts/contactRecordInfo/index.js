import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as Sentry from "@sentry/react";

import Container from "components/ui/container";
import GlobalNav from "partials/global-nav-v2";
import ContactFooter from "partials/global-footer";
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
import ClientNotes from "./clientNotes";
import WithLoader from "components/ui/WithLoader";
import { StageStatusProvider } from "contexts/stageStatus";

export default () => {
  const { pathname = "" } = useLocation();
  const [personalInfo, setPersonalInfo] = useState({});
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const value = pathname.split("/");
  const id = value.length > 0 ? value[2] : "";

  const getContactRecordInfo = useCallback(() => {
    setLoading(true);
    clientsService
      .getContactInfo(id)
      .then((data) => {
        setPersonalInfo(data);
        setReminders(data.reminders);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        Sentry.captureException(e);
      });
  }, [id]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  return (
    <React.Fragment>
      <StageStatusProvider>
        <Helmet>
          <title>MedicareCENTER - Contacts</title>
        </Helmet>
        <GlobalNav />
        <PersonalInfo personalInfo={personalInfo} />
        <Container className={styles.container}>
          <ToastContextProvider>
            {/* <p className={styles.header}>Contacts</p> */}

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
              <WithLoader isLoading={loading}>
                <Reminders
                  getContactRecordInfo={getContactRecordInfo}
                  leadId={id}
                  reminders={reminders}
                />
                <Activities />
                <ClientNotes personalInfo={personalInfo} />
              </WithLoader>
            </div>
          </ToastContextProvider>
        </Container>
        <ContactFooter hideMeicareIcon={true} />
      </StageStatusProvider>
    </React.Fragment>
  );
};
