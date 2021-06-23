import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav-v2";
import ContactFooter from "partials/global-footer";
import clientsService from "services/clientsService";
import styles from "../ContactsPage.module.scss";
import "./contactRecordInfo.scss";
import OverviewIcon from "components/icons/home";
import DetailsIcon from "components/icons/person";
import PreferencesIcon from "components/icons/settings";
import Warning from "components/icons/warning";
import PersonalInfo from "./PersonalInfo";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import WithLoader from "components/ui/WithLoader";
import { StageStatusProvider } from "contexts/stageStatus";
import OverView from "./Overview";
import Preferences from "./Preferences";
import Details from "./Details";
import analyticsService from "services/analyticsService";
import EditContactPage from "./DetailsEdit";
import ArrowdownIcon from "components/icons/menu-arrow-down";
import ArrowupIcon from "components/icons/menu-arrow-up";
export default () => {
  const { contactId: id, duplicateLeadId } = useParams();
  const [personalInfo, setPersonalInfo] = useState({});
  const [reminders, setReminders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState("OverView");
  const [menuToggle, setMenuToggle] = useState(false);

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

  const handleDisplay = (page) => {
    if (menuToggle) {
      setDisplay(page);
      setMenuToggle(false);
    } else {
      setMenuToggle(true);
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
            {duplicateLeadId && (
              <section className={styles["duplicate-contact-link"]}>
                <Warning />
                <span className="pl-1">
                  The entry is a potential duplicate to&nbsp;&nbsp;
                  <a
                    href={`/contact/${duplicateLeadId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    this contact link.
                  </a>
                </span>
              </section>
            )}
            <ul
              className={`mobile-menu leftcardmenu ${
                menuToggle ? "" : "item-selected"
              }`}
              data-gtm="contact-record-menu-item"
            >
              <li
                className={`${
                  menuToggle ? "" : "arrow-hide"
                } mobile-menu-arrow`}
                onClick={() => {
                  setMenuToggle(false);
                }}
              >
                <ArrowdownIcon />
              </li>

              <li
                className={`${
                  menuToggle ? "arrow-hide" : ""
                } mobile-menu-arrow`}
                onClick={() => {
                  setMenuToggle(true);
                }}
              >
                <ArrowupIcon />
              </li>

              <li
                className={`OverView ${
                  display === "OverView" ? "mobile-menu-active" : ""
                }`}
                onClick={() => handleDisplay("OverView")}
              >
                <label className="icon-spacing">
                  <OverviewIcon />
                </label>
                <span>Overview</span>
              </li>
              <li
                className={`Details DetailsEdit ${
                  display === "Details" || display === "DetailsEdit"
                    ? "mobile-menu-active"
                    : ""
                }`}
                onClick={() => handleDisplay("Details")}
              >
                <label className="icon-spacing">
                  <DetailsIcon />
                </label>
                <span>Details</span>
              </li>
              <li
                className={`Preferences ${
                  display === "Preferences" ? "mobile-menu-active" : ""
                }`}
                onClick={() => handleDisplay("Preferences")}
              >
                <label className="icon-spacing">
                  <PreferencesIcon />
                </label>
                <span>Preferences</span>
              </li>
            </ul>
            <PersonalInfo personalInfo={personalInfo} />
            <Container className={styles.container}>
              <ul
                className="leftcardmenu desktop-menu-hide"
                data-gtm="contact-record-menu-item"
              >
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
