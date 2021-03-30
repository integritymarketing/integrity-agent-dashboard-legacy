import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import Footer from "components/ui/Footer";
import GlobalNav from "partials/global-nav-v2";
import styles from "./ContactsPage.module.scss";
import Activity from "./activity/index";
  export default () => {
  const [sort, setSort] = React.useState(null)
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Contacts</title>
      </Helmet>
      <GlobalNav />
      <Container className={styles.container}>
        <p className={styles.header}>Contacts</p>

     <Activity />
      </Container>
      <Footer/>
    </React.Fragment>
  );
};
