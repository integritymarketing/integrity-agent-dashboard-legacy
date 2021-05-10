import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Container from "components/ui/container";
import ArrowIcon from "components/icons/arrow-right";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import LeadImporter from "partials/lead-importer";

export default () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>MedicareCENTER - Client Import</title>
      </Helmet>
      <div className="bg-photo bg-photo--alt text-invert">
        <GlobalNav />
        <Container className="scaling-header">
          <h2 className="hdg hdg--1">Client Import</h2>
        </Container>
      </div>

      <Container className="mt-scale-3">
        <div className="hdg hdg--3 content-center mb-4">
          <Link to="/contacts" className={`btn btn--outline btn--flex`}>
            <ArrowIcon className="icon-flip mr-1" /> Back to Client Management
          </Link>
        </div>

        <p className="mt-2 mb-2">
          Import a list of contacts in .csv format. To create a .csv file in
          Microsoft Excel, click on the File menu, then click Save As. In the
          file format dropdown, choose Comma Separated Values (.csv). The
          following fields are available for import (all are optional except
          Email):
        </p>
        <ul className="list-disc">
          <li>First Name</li>
          <li>Last Name</li>
          <li>Email</li>
          <li>Phone</li>
          <li>Postal Code</li>
          <li>Notes</li>
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
