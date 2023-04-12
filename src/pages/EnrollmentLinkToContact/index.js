import Footer from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import React from "react";
import styles from "./styles.module.scss";
import { Helmet } from "react-helmet-async";

export default function EnrollmentLinkToContact() {
  return (
    <>
      <Helmet>
        <title>MedicareCENTER - Enrollment Link to Contact</title>
      </Helmet>
      <GlobalNav />
      <div className={styles.container}>enrollment link to contact page</div>
      <Footer />
    </>
  );
}
