import React from "react";
import "./status-container.scss";

const SuccessContainer = ({ errors, successes }) => {
  if (successes === 0 && errors.length === 0) {
    return null;
  }

  return (
    <div
      className={`CSVImporter_successes ${
        successes === 0 ? "CSVImporter_successes--none" : ""
      } pt-2 pb-2 mb-4 text-left`}
    >
      <div className="hdg hdg--3">{`${successes} leads successfully imported`}</div>
    </div>
  );
};

const ErrorContainer = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="CSVImporter_errors pt-2 pb-2 mb-4 text-left">
      <p className="text-body mb-3 text-bold">
        The following contacts had issues and were not imported. Please review
        the issues and manually add or edit the contacts. If you want to import
        again, make changes to the contacts with issues in your CSV before
        uploading the file.
      </p>
      <ul>
        {errors
          .sort((a) => (a.Value === "Error" ? -1 : 1))
          .map((error, i) => {
            const formattedKey = (error.Key || error.key || "").replace(
              "(, )",
              ""
            );
            return (
              <li
                key={`${
                  error.Value || error.value || ""
                }--${formattedKey}--${i}`}
              >
                <span>{error.Value || error.value || ""}</span>:{" "}
                {`${formattedKey}`}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

const StatusContainer = ({ errors, successes }) => {
  return (
    <>
      <SuccessContainer successes={successes} errors={errors} />
      <ErrorContainer errors={errors} />
    </>
  );
};

export default StatusContainer;
