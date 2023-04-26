import React from "react";
import TooltipMUI from "packages/ToolTip";
import "./style.scss";

const APIFail = ({ title }) => {
  return (
    <div className={"status-item"}>
      <div className={"status-content"}>Status temporarily unavailable</div>
      <div className="status-icon">
        <TooltipMUI title={title} />
      </div>
    </div>
  );
};

export default APIFail;
