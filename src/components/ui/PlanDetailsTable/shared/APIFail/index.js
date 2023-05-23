import React from "react";
import TooltipMUI from "packages/ToolTip";
import "./style.scss";

const APIFail = ({ title }) => {
  let titleData =
    title === "Pharmacy"
      ? `Looks like you need to add a pharmacy, or there is a problem
with the Pharmacy Service provider. Please try again later.`
      : `${title} service partner is not returning current status. Please try again later.`;
  return (
    <div className={"status-item"}>
      <div className={"status-content"}>Status temporarily unavailable</div>
      <div className="status-icon">
        <TooltipMUI titleData={titleData} />
      </div>
    </div>
  );
};

export default APIFail;
