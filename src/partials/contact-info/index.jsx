import React from 'react';
import PropTypes from 'prop-types';

const ContactInfo = ({ className = '', testId, ...props }) => {
  return (
    <>
      <h2
        id="dialog_help_label"
        className={`hdg hdg--2 mb-1 ${className}`}
        data-testid={`${testId}-title`}
        {...props}
      >
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
        <a href="mailto:support@clients.integrity.com" className="link">
          support@clients.integrity.com
        </a>
      </p>
    </>
  );
};

ContactInfo.propTypes = {
  className: PropTypes.string,
  testId: PropTypes.string.isRequired,
};

ContactInfo.defaultProps = {
  className: '',
};

export default ContactInfo;
