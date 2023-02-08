import React from "react";
import { useHistory } from "react-router-dom";

import Back from "components/icons/back";
import "./index.scss";

export default ({ title = "", leadId }) => {
  const history = useHistory();
  const noTitle = title === "Back to ";
  const goBack = () => {
    if (noTitle) {
      history.push(`/contact/${leadId}`);
    } else {
      history.goBack();
    }
  };
  return (
    <div className="back-nav-header">
      <div className="nav-wrapper">
        <div onClick={goBack} className="back-button">
          <Back />
        </div>
        <div onClick={goBack} className="back-title">
          {title}
          {noTitle ? "Contact Details Page" : ""}
        </div>
      </div>
    </div>
  );
};
