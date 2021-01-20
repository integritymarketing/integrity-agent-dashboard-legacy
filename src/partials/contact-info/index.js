import React from "react";

export default ({ className = "", testId, ...props }) => {
  return (
    <React.Fragment>
      <h2 id="dialog_help_label" className="hdg hdg--2 mb-1">
        Contact Support
      </h2>
      <p
        id="dialog_help_desc"
        className="text-body mb-4"
        data-testid={`${testId}-copy`}
      >
        Call or email one of our support representatives to help resolve your
        issue.
      </p>
      <div className="hdg hdg--4 mb-1">Phone Number</div>
      <p className="text-body mb-4" data-testid={`${testId}-phone`}>
        <a href="tel:+1-888-818-3760" className="link">
          888-818-3760
        </a>
      </p>
      <div className="hdg hdg--4 mb-1">Email</div>
      <p className="text-body mb-4" data-testid={`${testId}-email`}>
        <a href="mailto:support@medicarecenter.com" className="link">
          support@medicarecenter.com
        </a>
      </p>
    </React.Fragment>
  );
};
