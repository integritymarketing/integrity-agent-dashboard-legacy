import React from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import LeadImporter from "partials/lead-importer";
import { Button } from "components/ui/Button";

import styles from "./ClientImportPage.module.scss";

const ClientImportPage = () => {
  const history = useHistory();

  const goToContactsPage = () => {
    history.push("/contacts");
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Client Import</title>
      </Helmet>
      <GlobalNav />
      <div>
        <Container>
          <h2 className={`hdg hdg--1 mt-5 ${styles["client-import"]}`}>
            Client Import
          </h2>
          <Button
            className={`mr-2 mt-4 ${styles.backButton}`}
            label="Back to Contacts"
            type="secondary"
            onClick={goToContactsPage}
          />
        </Container>
      </div>

      <Container className={`mt-scale-3 ${styles.importDiv}`}>
        <p className="mt-2 mb-2">
          Import a list of contacts in .csv format. To create a .csv file in
          Microsoft Excel, click on the File menu, then click Save As. In the
          file format dropdown, choose Comma Separated Values (.csv). The
          following fields are available for import (all are optional except
          Email and Phone):
        </p>
        <ul className="list-disc">
          <li>Contact Record Type</li>
          <li>First Name</li>
          <li>Last Name</li>
          <li>Email</li>
          <li>Phone {`(xxx-xxx-xxxx)`}</li>
          <li>Address</li>
          <li>State Abbreviation</li>
          <li>5 Digit Zip Code</li>
          <li>County</li>
          <li>Stage</li>
          <li>Client Notes</li>
        </ul>
        <p className="mt-2 mb-4">
          You may also download and use the template provided below.
        </p>

        <LeadImporter />
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};

export default ClientImportPage;
