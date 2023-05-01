import React from "react";
import TooltipMUI from "packages/ToolTip";
import "./style.scss";

const APIFail = ({ title }) => {
  return (
    <div className={"status-item"}>
      <div className={"status-content"}>Status temporarily unavailable</div>
      <div className="status-icon">
        <TooltipMUI
          title={`${title} service partner is not returning current status. Please try again later.`}
        />
      </div>
    </div>
  );
};

export default APIFail;
