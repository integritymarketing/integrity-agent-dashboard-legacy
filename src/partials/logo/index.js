import React from "react";
import useClientId from "hooks/auth/useClientId";
import ILSLogo from "../../images/auth/lead-center-rgb.png";
import footerLogo from "./logoWhite.svg";
import Logo from "./MedicareCENTER-Main.svg";
import "./index.scss";

export default ({ id, color = "#fff", ...props }) => {
  const clientId = useClientId();
  if (clientId === "ILSClient") {
    return (
      <img className="ils-logo" src={ILSLogo} alt="Integrity Lead Store" />
    );
  }
  if (id && id === "footerLogo") {
    return <img src={footerLogo} alt="footerLogo" className={"footerLogo"} />;
  }

  return <img src={Logo} alt="mainLogo" className={"mainLogo"} />;
};
