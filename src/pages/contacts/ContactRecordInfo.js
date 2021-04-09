import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import Footer from "components/ui/Footer";
import GlobalNav from "partials/global-nav-v2";
import styles from "./ContactsPage.module.scss";
import "./activity//activity.scss";
import OverviewIcon from "components/icons/home";
import DetailsIcon from "components/icons/person";
import PreferencesIcon from "components/icons/settings";
import Activity from "./activity/index";
import CLientNotes from './clientNotes';
export default () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Contacts</title>
      </Helmet>
      <GlobalNav />
      <Container className={styles.container}>
        <p className={styles.header}>Contacts</p>
        <ul className="leftcardmenu">
          <li className="active">
            <label className="icon-spacing">
              {" "}
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
        <Activity />
        <CLientNotes />
      </Container>
      <Footer />
    </React.Fragment>
  );
};
