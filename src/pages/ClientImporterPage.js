import React from "react";
import { Importer, ImporterField } from 'react-csv-importer';

// include the widget CSS file whichever way your bundler supports it
import 'react-csv-importer/dist/index.css';


export default () => {
  return (
    <Importer
      chunkSize={10000} // optional, internal parsing chunk size in bytes
      assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
      restartable={false} // optional, lets user choose to upload another file when import is complete
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
  );
};


