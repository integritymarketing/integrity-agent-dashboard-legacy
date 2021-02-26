import React, { useState } from "react";

import { Importer, ImporterField } from "react-csv-importer";

import { useHistory } from "react-router-dom";
import clientsService from "services/clientsService";
import authService from "services/authService";
import LeadImporterStatusContainer from "partials/lead-importer/status-container";
import { formatPhoneNumber } from "utils/phones";

import "./index.scss";

const prepareRowForImport = (row) => {
  row.leadStatusId = 1; // set leadStatusId to new
  row.phone = formatPhoneNumber(row.phone);
};

const LeadImporter = () => {
  const history = useHistory();
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccesses, setImportSuccesses] = useState([]);

  return (
    <>
      <LeadImporterStatusContainer
        errors={importErrors}
        successes={importSuccesses}
      />

      <div className="card">
        <h3 className="hdg hdg--3 mb-3">Import Leads By CSV File Upload</h3>
        <Importer
          chunkSize={10000} // optional, internal parsing chunk size in bytes
          assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
          restartable={false} // optional, lets user choose to upload another file when import is complete
          onStart={() => {
            // optional, invoked when user has mapped columns and started import
            // not much available in this method.. metadata basics like filename available.
            // see example: https://github.com/beamworks/react-csv-importer/blob/7aaa26962c3cd1a3bb1ea2ccef4f18ee2495fa87/demo-app/src/pages/ImportPage.tsx#L38
          }}
          processChunk={async (rows) => {
            // required, receives a list of parsed objects based on defined fields and user column mapping;
            // may be called several times if file is large
            rows.forEach((row) => prepareRowForImport(row));

            try {
              const response = await clientsService.createClients(rows);

              if (response.status >= 200 && response.status < 300) {
                // maybe show progress success per row better?
                rows.forEach((row) => {
                  setImportSuccesses((prevState) => [
                    ...prevState,
                    { id: row.email },
                  ]);
                });
              } else {
                if (response.status === 401) {
                  authService.handleExpiredToken(); // then?
                } else {
                  // status 400
                  const errorData = await response.json();
                  console.log({ errorData });
                  setImportErrors((importErrors) => [
                    ...importErrors,
                    {
                      id: 'bulk-creation',
                      message: errorData,
                    },
                  ]);
                }
              }
            } catch (e) {
              console.log({ e });
              setImportErrors((importErrors) => [
                ...importErrors,
                {
                  id: "bulk-creation",
                  message: `Unknown error`,
                },
              ]);
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
          <ImporterField name="firstName" label="First Name" optional />
          <ImporterField name="lastName" label="Last Name" optional />
          <ImporterField name="email" label="Email" />
          <ImporterField name="phone" label="Phone" optional />
          <ImporterField name="postalCode" label="Postal Code" optional />
          <ImporterField name="product" label="Product" optional />
          <ImporterField name="notes" label="Notes" optional />
        </Importer>
      </div>
    </>
  );
};

export default LeadImporter;
