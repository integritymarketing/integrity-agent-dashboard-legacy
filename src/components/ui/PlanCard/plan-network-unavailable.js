import React from "react";
import TooltipMUI from "packages/ToolTip";

const PlanCoverageUnavailable = ({ title }) => {
  return (
    <div className={"status-item"}>
      <div className={"status-text"}>
        {title} Looks like you need to add a pharmacy, or there is a problem
        with the Pharmacy Service provider. Please try again later.
      </div>
      <div className="status-icon">
        <TooltipMUI
          title={`${title} service partner is not returning current status. Please try again later.`}
        />
      </div>
    </div>
  );
};

export default PlanCoverageUnavailable;
