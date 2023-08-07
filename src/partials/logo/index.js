import React from "react";
import useClientId from "hooks/auth/useClientId";
import ILSLogo from "../../images/auth/lead-center-rgb.png";
import headerLogo from "./logoWhite.svg";
import footerLogo from "../../images/medicare-center.png";
import Logo from "./MedicareCENTER-Main.svg";
import "./index.scss";

const LogoComponent = ({ id, color = "#fff", ...props }) => {
  const clientId = useClientId();
  if (clientId === "ILSClient") {
    return (
      <img className="ils-logo" src={ILSLogo} alt="Integrity Lead Store" />
    );
  }
  if (id && id === "footerLogo") {
    return <img src={footerLogo} alt="footerLogo" className={"footerLogo"} />;
  }

  if (id && id === "headerLogo") {
    return <img src={headerLogo} alt="headerLogo" className={"footerLogo"} />;
  }

  return <img src={Logo} alt="mainLogo" className={"mainLogo"} />;
};

export default LogoComponent;
