import React from "react";
import PropTypes from 'prop-types';
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
      <img className="ils-logo" src={ILSLogo} alt="Integrity Lead Store" {...props} />
    );
  }
  if (id === "footerLogo") {
    return <img src={footerLogo} alt="Footer Logo" className="footerLogo" {...props} />;
  }
  if (id === "headerLogo") {
    return <img src={headerLogo} alt="Header Logo" className="footerLogo" {...props} />;
  }
  return <img src={Logo} alt="Main Logo" className="mainLogo" {...props} />;
};

LogoComponent.propTypes = {
  id: PropTypes.string,
  color: PropTypes.string
};

export default LogoComponent;
