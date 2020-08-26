import React from "react";

export default ({ className = "", ...props }) => {
  return (
    <React.Fragment>
      <div className="hdg hdg--2 mb-1">Contact Support</div>
      <p className="text-body mb-4">
        Call or email one of our support representatives to help resolve your
        issue.
      </p>
      <div className="hdg hdg--4 mb-1">Phone Number</div>
      <p className="text-body mb-4">
        <a href="tel:+1-651-555-1234" className="link">
          651-555-1234
        </a>
      </p>
      <div className="hdg hdg--4 mb-1">Email</div>
      <p className="text-body mb-4">
        <a href="mailto:support@medicarecenter.com" className="link">
          support@medicarecenter.com
        </a>
      </p>
    </React.Fragment>
  );
};
