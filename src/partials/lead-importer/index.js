import React, { useState, useRef } from "react";

import { Importer, ImporterField } from "react-csv-importer";

import { useHistory } from "react-router-dom";
import clientsService from "services/clientsService";
import authService from "services/authService";
import LeadImporterStatusContainer from "partials/lead-importer/status-container";
import { formatPhoneNumber } from "utils/phones";
import { getResourceUrl } from "pages/ResourcesPage";

import "./index.scss";

const prepareRowForImport = (row) => {
  row.leadStatusId = 1; // set leadStatusId to new
  row.phone = formatPhoneNumber(row.phone);
};

const LeadImporter = () => {
  const scrollToRef = useRef();
  const history = useHistory();
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccesses, setImportSuccesses] = useState(0);

  const handleImportError = (error) => {
    const newErrors =
      typeof error === "string" ? [{ Key: error, Value: "Error" }] : [...error];
    setImportErrors((importErrors) => [...importErrors, ...newErrors]);
  };

  const templateUrl = getResourceUrl("MedicareCENTER-Client-Import.csv");

  return (
    <div ref={scrollToRef}>
      <LeadImporterStatusContainer
        errors={importErrors}
        successes={importSuccesses}
      />

      <div className="card">
        <h3 className="hdg hdg--3 mb-3">
          Import Leads By CSV File Upload{" "}
          <a href={templateUrl} download={templateUrl} className={`btn ml-2`}>
            Download Template
          </a>
        </h3>
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
              const response = await clientsService.bulkCreateClients(rows);
              const data = await response.json();

              if (response.status >= 200 && response.status < 300) {
                setImportSuccesses(
                  (prevState) => prevState + data.successfulUploadCount
                );
                handleImportError(data.uploadErrorResponse);
              } else {
                if (response.status === 401) {
                  authService.handleExpiredToken(); // then?
                } else {
                  handleImportError((data || {}).uploadErrorResponse || data);
                }
              }
            } catch (e) {
              console.log({ e });
              handleImportError(`An internal error has occurred.`);
            }
          }}
          onComplete={async () => {
            ((scrollToRef || {}).current || {}).scrollIntoView();
            // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
            // maybe show import issues in summary modal?
          }}
          onClose={() => {
            // optional, invoked when import is done and user clicked "Finish"
            history.push("contacts");
          }}
        >
          <ImporterField
            name="contactRecordType"
            label="Contact Record Type"
            optional
          />
          <ImporterField name="firstName" label="First Name" optional />
          <ImporterField name="lastName" label="Last Name" optional />
          <ImporterField name="email" label="Email" />
          <ImporterField name="phone" label="Phone" />
          <ImporterField name="address1" label="Address 1" optional />
          <ImporterField name="address2" label="Address 2" optional />
          <ImporterField name="city" label="City" optional />
          <ImporterField name="state" label="State" optional />
          <ImporterField name="postalCode" label="Postal Code" optional />
          <ImporterField name="county" label="County" optional />
          <ImporterField name="stage" label="Stage" optional />
          <ImporterField name="notes" label="Notes" optional />
        </Importer>
      </div>
    </div>
  );
};

export default LeadImporter;
