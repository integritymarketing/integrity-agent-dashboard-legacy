import React from "react";
import Popover from "components/ui/Popover";
import Info from "components/icons/info-blue";

const PlanCoverageUnavailable = ({ title }) => {
  return (
    <div className={"status-item"}>
      <div className={"status-text"}>
        {title} status temporarily unavailable
      </div>
      <div className="status-icon">
        <Popover
          openOn="hover"
          icon={<Info />}
          align={"start"}
          title={""}
          description="Client Snapshot shows the number of contacts that are in each stage for MedicareCENTER only."
        >
          <Info />
        </Popover>
      </div>
    </div>
  );
};

export default PlanCoverageUnavailable;
