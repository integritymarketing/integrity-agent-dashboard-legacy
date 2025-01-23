import React from "react";
import TooltipMUI from "packages/ToolTip";

const PlanCoverageUnavailable = ({ title }) => {
  return (
    <div className={"status-item"}>
      <div className={"status-text"}>
        {title} status temporarily unavailable
      </div>
      <div className="status-icon">
        <TooltipMUI title={title} />
      </div>
    </div>
  );
};

export default PlanCoverageUnavailable;
