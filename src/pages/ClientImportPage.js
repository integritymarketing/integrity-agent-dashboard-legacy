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
          <Link to="/clients" className={`btn btn--outline btn--flex`}>
            <ArrowIcon className="icon-flip mr-1" /> Back to Client Management
          </Link>
        </div>

        <LeadImporter />
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
