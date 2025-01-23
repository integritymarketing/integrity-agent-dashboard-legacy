import React from "react";
import "./modalText.scss";

function LeadText({ title }) {
  return (
    <div>
      <div className="modalTextLead">
        <span className="modalTextFont">{title}</span>
      </div>
    </div>
  );
}
export default LeadText;
