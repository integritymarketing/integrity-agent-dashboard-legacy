import React, { useState } from "react";

import { Importer, ImporterField } from "react-csv-importer";
import "react-csv-importer/dist/index.css";

import { useHistory, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import clientsService from "services/clientsService";
import authService from "services/authService";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import GlobalFooter from "partials/global-footer";
import { formatPhoneNumber } from "utils/phones";

const prepareRowForImport = (row) => {
  row.leadStatusId = 1; // set leadStatusId to new
  row.phone = formatPhoneNumber(row.phone);
};

export default () => {
  const history = useHistory();
  const [importErrors, setImportErrors] = useState([]);

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

      {importErrors.length > 0 && (
        <Container className="mt-scale-3">
          <div className="pt-3 pb-5 text-center">
            <div className="hdg hdg--2 mb-1">Sorry</div>
            <p className="text-bod mb-3">
              We were unable to process the complete client import at this time.
              Please review the issues
              <ul>
                {importErrors.map((error, i) => {
                  return <li>{error}</li>;
                })}
              </ul>
            </p>
          </div>
        </Container>
      )}
      <Container className="mt-scale-3">
        <Link to="/clients">Back to Client Management</Link>

        <Importer
          chunkSize={10000} // optional, internal parsing chunk size in bytes
          assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
          restartable={true} // optional, lets user choose to upload another file when import is complete
          onStart={() => {
            // optional, invoked when user has mapped columns and started import
            // not much available in this method.. metadata basics like filename available.
            // see example: https://github.com/beamworks/react-csv-importer/blob/7aaa26962c3cd1a3bb1ea2ccef4f18ee2495fa87/demo-app/src/pages/ImportPage.tsx#L38
          }}
          processChunk={async (rows) => {
            // required, receives a list of parsed objects based on defined fields and user column mapping;
            // may be called several times if file is large
            for (let row of rows) {
              prepareRowForImport(row);

              try {
                let response;
                response = await clientsService.createClient(row);

                if (response.status >= 200 && response.status < 300) {
                  // maybe show progress success per row better?
                } else {
                  if (response.status === 401) {
                    authService.handleExpiredToken(); // then?
                  } else {
                    // status 400
                    const errorData = await response.json();
                    setImportErrors((importErrors) => [
                      ...importErrors,
                      `Validation error when attempting to save ${row.email}: ${errorData}`,
                    ]);
                  }

                  // maybe update if conflict or error?
                  // response = await clientsService.updateClient(
                  //   stagedClient,
                  //   values
                  // );
                }
              } catch (e) {
                setImportErrors((importErrors) => [
                  ...importErrors,
                  `Critical error when attempting to save ${row.email}`,
                ]);

                return;
              }
            }
          }}
          onComplete={() => {
            // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
            // maybe show import issues in summary modal?
          }}
          onClose={() => {
            // optional, invoked when import is done and user clicked "Finish"
            history.push("clients");
          }}
        >
          <ImporterField name="firstName" label="First Name" />
          <ImporterField name="lastName" label="Last Name" />
          <ImporterField name="email" label="Email" />
          <ImporterField name="phone" label="Phone" optional />
          <ImporterField name="postalCode" label="Postal Code" optional />
          <ImporterField name="product" label="Product" optional />
          <ImporterField name="notes" label="Notes" optional />
        </Importer>
      </Container>
      <GlobalFooter />
    </React.Fragment>
  );
};
