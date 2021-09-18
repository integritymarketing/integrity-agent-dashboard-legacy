import React from "react";
import { useHistory } from "react-router-dom";

import Back from "components/icons/back";
import "./index.scss";

export default ({title = ""}) => {
    const history = useHistory();
  return <div className="back-nav-header">
      <div className="nav-wrapper">
      <div onClick={history.goBack} className="back-button"><Back/></div>
      <div onClick={history.goBack} className="back-title">{title}</div>
      </div>
  </div>;
};
