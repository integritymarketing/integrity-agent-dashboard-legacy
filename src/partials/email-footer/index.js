import React from "react";
import "./index.scss";
import FooterLogo from "./image.svg";

export default () => {
  const currentDate = new Date().getFullYear();
  return (
    <footer className="footer-unauthenticated">
      <img className="logo" src={FooterLogo} alt="Medicare Center" />
      <div className="copyright pb-1">
        ©{currentDate} Integrity, All rights reserved.
      </div>
    </footer>
  );
};
