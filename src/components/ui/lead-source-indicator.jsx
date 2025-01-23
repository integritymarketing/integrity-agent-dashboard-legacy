import React from "react";

const LeadSourceIndicator = ({ leadStatusId }) => {
  const isStatusNew = leadStatusId === 1;
  return (
    <div
      className={`lead-source-indicator ${
        isStatusNew ? "lead-source-indicator-new" : ""
      }`}
    >
      <div className="tooltip">
        <div className={`statusDot ${isStatusNew ? "statusDot-new" : ""}`} />
        Assigned Lead
      </div>
    </div>
  );
};

export default LeadSourceIndicator;
