import React, { useCallback, useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import { useParams, useLocation, useHistory } from "react-router-dom";
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
import BackNavContext from "contexts/backNavProvider";
import OverView from "./Overview";
import Preferences from "./Preferences";
import Details from "./Details";
import analyticsService from "services/analyticsService";
import ArrowdownIcon from "components/icons/menu-arrow-down";
import ArrowupIcon from "components/icons/menu-arrow-up";
import { Button } from "components/ui/Button";
import SOAicon from "components/icons/soa";
import ScopeOfAppointment from "./soaList/ScopeOfAppointment";

export default () => {
  const { contactId: id } = useParams();
  const { state = {} } = useLocation();
  const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
  const [duplicateLeadIdName, setDuplicateLeadIdName] = useState();
  const [personalInfo, setPersonalInfo] = useState({ addresses: [] });
  const [reminders, setReminders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState("OverView");
  const [menuToggle, setMenuToggle] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const { setCurrentPage } = useContext(BackNavContext);
  const history = useHistory();

  useEffect(() => {
    setCurrentPage("Contact Detail Page");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContactRecordInfo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientsService.getContactInfo(id);
      setPersonalInfo(data);
      setReminders(data.reminders);
      setActivities(data.activities);
      const { firstName, lastName, leadsId, emails, phones } = data;
      const email = emails?.[0]?.leadEmail ?? "";
      const leadPhone = phones?.[0]?.leadPhone ?? "";
      const leadPhoneLabel = phones?.[0]?.phoneLabel ?? "";
      const phone = { leadPhone, leadPhoneLabel };
      const values = {
        firstName,
        lastName,
        phones: phone,
        email,
        leadId: leadsId,
      };
      const response = await clientsService.getDuplicateContact(values);
      if (response.ok) {
        const resMessage = await response.json();
        const duplicateLeadIds = resMessage.duplicateLeadIds;
        if (duplicateLeadIds.length === 1) {
          const getFullNameById = await clientsService.getContactInfo(
            duplicateLeadIds[0]
          );
          const { firstName, middleName, lastName } = getFullNameById;
          setDuplicateLeadIdName(
            `${firstName} ${middleName || ""} ${lastName}`
          );
          if (resMessage.isPartialDuplicate && duplicateLeadIds[0] !== id) {
            setDuplicateLeadIds(duplicateLeadIds);
          }
        } else {
          if (resMessage.isPartialDuplicate && duplicateLeadIds[0] !== id) {
            setDuplicateLeadIds(duplicateLeadIds);
          }
        }
      }
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/contact-record-note-edit/",
    });
    getContactRecordInfo();
    setEdit(state.isEdit);
    setDisplay(state.display || "OverView");
  }, [getContactRecordInfo, state.isEdit, state.display]);

  const handleRendering = () => {
    let props = {
      id,
      personalInfo,
      reminders,
      getContactRecordInfo: () => getContactRecordInfo(),
      setDisplay: (value) => setDisplay(value),
      activities,
      setEdit: (value) => setEdit(value),
      isEdit,
    };
    switch (display) {
      case "OverView":
        return <OverView {...props} />;
      case "Details":
        return <Details {...props} />;
      case "ScopeOfAppointment":
        return <ScopeOfAppointment {...props} />;
      case "Preferences":
        return <Preferences {...props} />;
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

  const handleMultileDuplicates = () => {
    if (duplicateLeadIds.length) {
      window.localStorage.setItem(
        "duplicateLeadIds",
        JSON.stringify(duplicateLeadIds)
      );
    }
    return true;
  };

  const isLoading = loading;

  const handleViewPlans = (isMobile) => {
    const county = personalInfo?.addresses[0]?.county;
    const postalCode = personalInfo?.addresses[0]?.postalCode;
    if (county && postalCode) {
      if (isMobile)
        return <Button label="View Available Plans" type="secondary" />;
      return <Button label="View Available Plans" type="primary" />;
    } else
      return (
        <Button
          label="Add Zip Code to View Plans"
          type="primary"
          disabled={true}
        />
      );
  };

  return (
    <React.Fragment>
      <ToastContextProvider>
        <WithLoader isLoading={isLoading}>
          <StageStatusProvider>
            <Helmet>
              <title>MedicareCENTER - Contacts</title>
            </Helmet>
            <GlobalNav />
            {duplicateLeadIds.length === 1 && (
              <section className={`${styles["duplicate-contact-link"]} pl-1`}>
                <Warning />
                <span className="pl-1">
                  The entry is a potential duplicate to&nbsp;&nbsp;
                  <a
                    href={`/contact/${duplicateLeadIds}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {duplicateLeadIdName ?? "this contact link."}
                  </a>
                </span>
              </section>
            )}
            {duplicateLeadIds.length > 1 && (
              <section className={`${styles["duplicate-contact-link"]} pl-1`}>
                <Warning />
                <span className="pl-1">
                  The entry is a potential duplicate to&nbsp;&nbsp;
                  <a
                    onClick={handleMultileDuplicates}
                    href={`/contacts`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    these contacts
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
                className={`ScopeOfAppointment ${
                  display === "ScopeOfAppointment" ? "mobile-menu-active" : ""
                }`}
                onClick={() => handleDisplay("ScopeOfAppointment")}
              >
                <label className="icon-spacing">
                  <SOAicon />
                </label>
                <span>Scope Of Appointments</span>
              </li>

              <li
                className="plans-button"
                onClick={() => {
                  history.push(`/plans/${id}`);
                }}
              >
                {handleViewPlans(true)}
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
            <PersonalInfo
              personalInfo={personalInfo}
              setEdit={setEdit}
              isEdit={isEdit}
              setDisplay={setDisplay}
            />
            <div className="details-card-main">
              <Container className={styles.container}>
                <ul
                  className="leftcardmenu desktop-menu-hide"
                  data-gtm="contact-record-menu-item"
                >
                  <li
                    className={display === "OverView" ? "active" : ""}
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
                      display === "Details" || display === "DetailsEdit"
                        ? "active"
                        : ""
                    }
                    onClick={() => setDisplay("Details")}
                  >
                    <label className="icon-spacing">
                      <DetailsIcon />
                    </label>
                    <span>Details</span>
                  </li>
                  <li
                    className={display === "ScopeOfAppointment" && "active"}
                    onClick={() => setDisplay("ScopeOfAppointment")}
                  >
                    <label className="icon-spacing">
                      <SOAicon />
                    </label>
                    <span>Scope Of Appointments</span>
                  </li>
                  <li
                    className={display === "Preferences" ? "active" : ""}
                    onClick={() => setDisplay("Preferences")}
                  >
                    <label className="icon-spacing">
                      <PreferencesIcon />
                    </label>
                    <span>Preferences </span>
                  </li>
                  <li
                    className="plans-button"
                    onClick={() => {
                      history.push(`/plans/${id}`);
                    }}
                  >
                    {handleViewPlans(false)}
                  </li>
                </ul>
                <div className="rightSection">{handleRendering()}</div>
              </Container>
            </div>
            <ContactFooter hideMedicareIcon={true} />
          </StageStatusProvider>
        </WithLoader>
      </ToastContextProvider>
    </React.Fragment>
  );
};
