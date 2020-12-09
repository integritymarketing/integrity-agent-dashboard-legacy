import React, {
//  useState,
} from "react";

import { Link } from "react-router-dom";
import { Importer, ImporterField } from 'react-csv-importer';
import { Helmet } from "react-helmet-async";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";

// include the widget CSS file whichever way your bundler supports it
import 'react-csv-importer/dist/index.css';

export default () => {
  const hasLoadError = false
  // const [hasLoadError, setLoadError] = useState(false);
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

      {hasLoadError && (
        <Container className="mt-scale-3">
          <div className="pt-3 pb-5 text-center">
            <div className="hdg hdg--2 mb-1">Error</div>
            <p className="text-bod mb-3">
              We were unable to process the client import at this time. Please try again
              later.
            </p>
            <button className="btn" onClick={() => {}}>
              Retry
            </button>
          </div>
        </Container>
      )}
      <Container className="mt-scale-3">
        <Link to='/clients'>Back to Client Management</Link>

        <Importer
          chunkSize={10000} // optional, internal parsing chunk size in bytes
          assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
          restartable={true} // optional, lets user choose to upload another file when import is complete
          onStart={() => {
            // optional, invoked when user has mapped columns and started import
            // prepMyAppForIncomingData();
          }}
          processChunk={async (rows) => {
            // required, receives a list of parsed objects based on defined fields and user column mapping;
            // may be called several times if file is large
            // (if this callback returns a promise, the widget will wait for it before parsing more data)
            // for (row of rows) {
              // await myAppMethod(row);
            // }
          }}
          onComplete={() => {
            // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
            // showMyAppToastNotification();
          }}
          onClose={() => {
            // optional, invoked when import is done and user clicked "Finish"
            // (if this is not specified, the widget lets the user upload another file)
            // goToMyAppNextPage();
          }}
        >
          <ImporterField name="name" label="Name" />
          <ImporterField name="email" label="Email" />
          <ImporterField name="dob" label="Date of Birth" optional />
          <ImporterField name="postalCode" label="Postal Code" optional />
        </Importer>

      </Container>
      <GlobalFooter />
    </React.Fragment>
  );

};


