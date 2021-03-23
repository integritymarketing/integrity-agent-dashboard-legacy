import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav-v2";
import ContactsTable from "./ContactsTable";
import styles from "./ContactsPage.module.scss";

export default () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Contacts</title>
      </Helmet>
      <GlobalNav />
      <Container className={styles.container}>
        <h2 className="hdg hdg--2 text-blue">Contacts</h2>
        <div className={styles.header}>Header</div>
        <div className={styles.tableWrapper}>
          <ContactsTable />
        </div>
      </Container>
    </React.Fragment>
  );
};
