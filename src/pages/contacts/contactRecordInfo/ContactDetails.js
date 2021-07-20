import React, { useState } from "react";
import { formatPhoneNumber } from "utils/phones";
import DeleteLeadModal from "./DeleteLeadModal";

const notAvailable = "-";

export default ({ setDisplay, personalInfo, ...rest }) => {
  let {
    firstName = "",
    middleName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    leadsId = null,
  } = personalInfo;

  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

  emails = emails.length > 0 ? emails[0].leadEmail : notAvailable;
  const phoneData = phones.length > 0 ? phones[0] : null;
  const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";

  const addressData = addresses.length > 0 ? addresses[0] : null;
  const city = addressData && addressData.city ? addressData.city : "";
  const stateCode =
    addressData && addressData.stateCode ? addressData.stateCode : "";
  const address1 =
    addressData && addressData.address1 ? addressData.address1 : "";
  const address2 =
    addressData && addressData.address2 ? addressData.address2 : "";
  const postalCode =
    addressData && addressData.postalCode ? addressData.postalCode : "";

  return (
    <>
      <div className="contactDetailsSection">
        <div className="contact-details-row mobile-responsive-row">
          <div className="contact-details-col1">
            <p className="contact-details-label">First Name</p>
            <span className="contact-details-name">
              {firstName || notAvailable}
            </span>
          </div>
          <div className="custom-w-25 contact-details-col1">
            <p className="contact-details-label">Middle Initial</p>
            <span className="contact-details-name">
              {middleName || notAvailable}
            </span>
          </div>
          <div className="custom-w-25 contact-details-col1 mob-res-margin">
            <p className="contact-details-label">Last Name</p>
            <span className="contact-details-name">
              {lastName || notAvailable}
            </span>
          </div>
        </div>
        <div className="custom-mob-email-row contact-details-row">
          <div className="contact-details-col1">
            <p className="contact-details-label">E-mail</p>
            <span className="contact-details-name">{emails}</span>
          </div>
          <div className="custom-w-59 custom-w-25 contact-details-col1">
            <p className="contact-details-label">Phone Number</p>
            <span className="mob-mb-24 contact-details-name">
              {phones ? formatPhoneNumber(phone) : notAvailable}
            </span>
          </div>
        </div>
        <div className="custom-mob-address-row contact-details-row">
          <div className="contact-details-col1">
            <p className="contact-details-label">Address</p>
            <span className="mob-mb-24 contact-details-name">
              {address1 || notAvailable}
            </span>
          </div>
          <div className="custom-w-59 custom-w-25 contact-details-col1">
            <p className="contact-details-label">Address2</p>
            <span className="contact-details-name">
              {address2 || notAvailable}
            </span>
          </div>
        </div>
        <div className="contact-details-row mobile-responsive-row">
          <div className="contact-details-col1">
            <p className="contact-details-label">City</p>
            <span className="contact-details-name">{city || notAvailable}</span>
          </div>
          <div className="custom-w-25 contact-details-col1">
            <p className="contact-details-label">State</p>
            <span className="contact-details-name">
              {stateCode || notAvailable}
            </span>
          </div>
          <div className="custom-w-25 contact-details-col1 mob-res-margin">
            <p className="contact-details-label">ZIP</p>
            <span className="contact-details-name">
              {postalCode || notAvailable}
            </span>
          </div>
        </div>
      </div>
      <div className="deletecontactsection">
        <button onClick={() => setDeleteModalStatus(true)}>
          Delete Contact
        </button>
      </div>
      <DeleteLeadModal
        leadsId={leadsId}
        leadName={firstName + " " + middleName + " " + lastName}
        deleteModalStatus={deleteModalStatus}
        setDeleteModalStatus={() => setDeleteModalStatus(false)}
      />
    </>
  );
};
