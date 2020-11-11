import React from "react";

const LeadSourceIndicator = ({ leadStatusId }) => {
  const isStatusNew = leadStatusId === 1;
  return (
    <div
      className={`lead-source-indicator ${
        isStatusNew ? "lead-source-indicator-new" : ""
      }`}
    >
      <span className="tooltip">
        <div className={`statusDot ${isStatusNew ? "statusDot-new" : ""}`} />
        Assigned Lead
      </span>
    </div>
  );
};

export default LeadSourceIndicator;
