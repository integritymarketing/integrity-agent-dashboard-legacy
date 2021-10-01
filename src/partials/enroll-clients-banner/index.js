import React from "react";
import { Link } from "react-router-dom";
import analyticsService from "services/analyticsService";
import "./index.scss";
import image from "./image.png";
import mobileImage from "./mobileImage.png";

const EnrollClientBanner = () => (
  <div className="enrollClientBanner">
    <div className="content-enroll">
      <div className="enroll-content">
        <div className="content-container">
          <h3 className="heading3">A New Way to Enroll Clients</h3>
          <p>
            Quote and enroll directly from the CRM with the new, updated
            MedicareCENTER.
          </p>
          <div className="pt-2 button-wrapper">
            <Link
              data-gtm="hp-category-wrapper-item-button"
              to="/contacts"
              className={`btn--invert cta-button ${analyticsService.clickClass(
                "crm-button"
              )}`}
            >
              View Contacts
            </Link>
          </div>
        </div>
      </div>
      <img src={mobileImage} alt="plans" className="mobile image"></img>
      <img src={image} alt="plans" className="large-screen image"></img>
    </div>
  </div>
);

export default EnrollClientBanner;
