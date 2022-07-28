import React from "react";
import useClientId from "hooks/auth/useClientId";
import ILSLogo from "../../images/auth/lead-center-rgb.png";
import logo from "./MedicareCENTER-W_copy_4_ 2.svg";
import footerLogo from "./MedicareCENTER (1) 2.svg";

import "./index.scss";

export default ({ id, color = "#fff", ...props }) => {
  const clientId = useClientId();
  if (clientId === "ILSClient") {
    return (
      <img className="ils-logo" src={ILSLogo} alt="Integrity Lead Store" />
    );
  }
  if (id === "footerLogo") {
    return <img src={footerLogo} alt="footerLogo" className={"footerLogo"} />;
  }
  return <img src={logo} alt="logo" className={"logo"} />;
};
