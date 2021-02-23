import React from "react";
import "./status-container.scss";

const SuccessContainer = ({ errors, successes }) => {
  if (successes.length === 0 && errors.length === 0) {
    return null;
  }

  return (
    <div
      className={`CSVImporter_successes ${
        successes.length === 0 ? "CSVImporter_successes--none" : ""
      } pt-2 pb-2 mb-4 text-left`}
    >
      <div className="hdg hdg--3">{`${successes.length} leads successfully imported`}</div>
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
        {`Unable to import ${errors.length} rows. Please review the issues:`}
      </p>
      <ul>
        {errors.map((error) => {
          return (
            <li key={error.id}>
              Error importing <span>{error.id}</span>: {`${error.message}`}
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
