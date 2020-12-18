import React from "react";
import "./error-container.scss";

const ErrorContainer = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="CSVImporter_errors pt-2 pb-2 mb-4 text-left">
      <div className="hdg hdg--2 mb-1">Attention</div>
      <p className="text-bod mb-3">
        We were unable to process the complete client import at this time.
        Please review the issues:
      </p>
      <ul>
        {errors.map((error) => {
          return <li key={error.key}>{error.message}</li>;
        })}
      </ul>
    </div>
  );
};

export default ErrorContainer;
