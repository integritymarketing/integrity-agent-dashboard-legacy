import React from "react";
import { formatPhoneNumber } from "utils/phones";
import Editicon from "components/icons/edit-details";
const notAvailable = "-";

export default ({ setDisplay, personalInfo, ...rest }) => {
  let {
    firstName = "",
    middleName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    contactPreferences,
    contactRecordType = "prospect",
  } = personalInfo;

  emails = emails?.length > 0 ? emails[0]?.leadEmail : notAvailable;
  const phoneData = phones.length > 0 ? phones[0] : null;
  const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
  const phoneLabel =
    phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "Mobile";

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
  const county =
    addressData && addressData.county ? addressData.county : notAvailable;

  const isPrimary = contactPreferences?.primary
    ? contactPreferences?.primary
    : "phone";

  return (
    <>
      <div className="scope-details-card-header contactdetailscardheader">
        <h4>Contact Details</h4>
        {!rest.isEdit && (
          <button className="send-btn" onClick={() => rest.setEdit(true)}>
            <Editicon />
            <span className="edit-btn-text">Edit</span>
          </button>
        )}
      </div>
      <div className="contactdetailscardbody">
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
            {/* DOB fiels will go in the Next release */}
            {/* <div className="responsive-display contact-details-col1">
              <p className="contact-details-label">Date Of Birth</p>
              <span className="mob-mb-24 contact-details-name">10/06/1994</span>
            </div> */}
          </div>
          <div className=" custom-mob-address-row contact-details-row">
            {/* <div className="responsive-d-none contact-details-col1">
              <p className="contact-details-label">Date Of Birth</p>
              <span className="mob-mb-24 contact-details-name"> -- </span>
            </div> */}
            <div className="custom-w-59 custom-w-25 contact-details-col1">
              <p className="contact-details-label">Contact Record Type</p>
              <span className="contact-details-name text-capitalize">
                {contactRecordType}
              </span>
            </div>
          </div>
          <div className="custom-mob-email-row contact-details-row">
            <div className="contact-details-col1">
              <p className="contact-details-label ">E-Mail</p>
              <span className="contact-details-name">{emails}</span>
              {isPrimary === "email" && (
                <span className="primary-communication-label">
                  Primary Communication
                </span>
              )}
            </div>
            <div className="responsive-inline">
              <div className="w-50 custom-w-25 contact-details-col1">
                <p className="contact-details-label">Phone Number</p>
                <span className="contact-details-name">
                  {phones ? formatPhoneNumber(phone) : notAvailable}
                </span>
                {isPrimary === "phone" && (
                  <span className="primary-communication-label">
                    Primary Communication
                  </span>
                )}
              </div>
              <div className="custom-w-43 custom-w-25 contact-details-col1">
                <p className="contact-details-label">Label</p>
                <span className="mob-mb-24 contact-details-name text-capitalize">
                  {phoneLabel}
                </span>
              </div>
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
            <div className="custom-w-53 contact-details-col1">
              <p className="contact-details-label">City</p>
              <span className="contact-details-name">
                {city || notAvailable}
              </span>
            </div>
            <div className="custom-w-22 custom-w-25 contact-details-col1">
              <p className="contact-details-label">State</p>
              <span className="contact-details-name">
                {stateCode || notAvailable}
              </span>
            </div>
            <div className="custom-w-20 custom-w-25 contact-details-col1 mob-res-margin">
              <p className="contact-details-label">ZIP</p>
              <span className="contact-details-name">
                {postalCode || notAvailable}
              </span>
            </div>
            <div className="custom-w-31 custom-w-25 contact-details-col1 mob-res-margin">
              <p className="contact-details-label">County</p>
              <span className="contact-details-name">{county}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
