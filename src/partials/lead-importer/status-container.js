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
        {`Import errors occurred, please review the issues:`}
      </p>
      <ul>
        {errors
          .sort((a) => (a.Value === "Error" ? -1 : 1))
          .map((error, i) => {
            const formattedKey = error.Key.replace("(, )", "");
            return (
              <li key={`${error.Value}--${formattedKey}--${i}`}>
                <span>{error.Value}</span>: {`${formattedKey}`}
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
