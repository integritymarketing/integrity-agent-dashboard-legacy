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
import PersonalInfo from "./PersonalInfo";
import { useLocation } from "react-router-dom";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import WithLoader from "components/ui/WithLoader";
import { StageStatusProvider } from "contexts/stageStatus";
import OverView from "./Overview";
import Preferences from "./Preferences";
import Details from "./Details";
import analyticsService from "services/analyticsService";
import EditContactPage from "./DetailsEdit";

export default () => {
  const { pathname = "" } = useLocation();
  const [personalInfo, setPersonalInfo] = useState({});
  const [reminders, setReminders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState("OverView");
  const value = pathname.split("/");
  const id = value.length > 0 ? value[2] : "";

  const getContactRecordInfo = useCallback(() => {
    setLoading(true);
    clientsService
      .getContactInfo(id)
      .then((data) => {
        setPersonalInfo(data);
        setReminders(data.reminders);
        setActivities(data.activities);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        Sentry.captureException(e);
      });
  }, [id]);

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/contact-record-note-edit/",
    });
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  const handleRendering = () => {
    let props = {
      id,
      personalInfo,
      reminders,
      getContactRecordInfo: () => getContactRecordInfo(),
      setDisplay: (value) => setDisplay(value),
      activities,
    };
    switch (display) {
      case "OverView":
        return <OverView {...props} />;
      case "Details":
        return <Details {...props} />;
      case "Preferences":
        return <Preferences {...props} />;
      case "DetailsEdit":
        return <EditContactPage {...props} />;
      default:
        return <OverView {...props} />;
    }
  };

  return (
    <React.Fragment>
      <ToastContextProvider>
        <WithLoader isLoading={loading}>
          <StageStatusProvider>
            <Helmet>
              <title>MedicareCENTER - Contacts</title>
            </Helmet>
            <GlobalNav />
            <PersonalInfo personalInfo={personalInfo} />
            <Container className={styles.container}>
              <ul className="leftcardmenu" data-gtm="contact-record-menu-item">
                <li
                  className={display === "OverView" && "active"}
                  onClick={() => {
                    setDisplay("OverView");
                  }}
                >
                  <label className="icon-spacing">
                    <OverviewIcon />
                  </label>
                  <span>Overview</span>
                </li>
                <li
                  className={
                    (display === "Details" || display === "DetailsEdit") &&
                    "active"
                  }
                  onClick={() => setDisplay("Details")}
                >
                  <label className="icon-spacing">
                    <DetailsIcon />
                  </label>
                  <span>Details</span>
                </li>
                <li
                  className={display === "Preferences" && "active"}
                  onClick={() => setDisplay("Preferences")}
                >
                  <label className="icon-spacing">
                    <PreferencesIcon />
                  </label>
                  <span>Preferences</span>
                </li>
              </ul>
              <div className="rightSection">{handleRendering()}</div>
            </Container>
            <ContactFooter hideMeicareIcon={true} />
          </StageStatusProvider>
        </WithLoader>
      </ToastContextProvider>
    </React.Fragment>
  );
};
