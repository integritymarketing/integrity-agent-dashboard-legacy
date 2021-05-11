import React from "react";
import { formatPhoneNumber } from "utils/phones";

const notAvailable = "N/A";

export default ({ setDisplay, personalInfo, ...rest }) => {
  let {
    firstName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    contactRecordType = "",
  } = personalInfo;

  emails = emails.length > 0 ? emails[0].leadEmail : notAvailable;
  phones = phones.length > 0 ? phones[0] : null;
  addresses = addresses.length > 0 ? addresses[0] : null;

  return (
    <>
      <div className="contactdetailscard">
        <div className="contactdetailscardheader">
          <h4>Contact Details</h4>
          <button onClick={() => setDisplay("DetailsEdit")}>Edit</button>
        </div>
        <div className="contactdetailscardbody">
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>First Name</p>
              <div className="contactdetailscardbodycolvalue">{firstName}</div>
            </div>
          </div>
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Last Name</p>
              <div className="contactdetailscardbodycolvalue">{lastName}</div>
            </div>
          </div>
          <hr className="contactdetailscardborder" />
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Address</p>
              <div className="contactdetailscardbodycolvalue">
                {addresses
                  ? addresses.address1 + " " + addresses.address2 + ","
                  : notAvailable}
              </div>
            </div>
          </div>
          <div className="contactdetailscardbodyrowspacing contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>City</p>
              <div className="contactdetailscardbodycolvalue">
                {addresses ? addresses.city : notAvailable}
              </div>
            </div>
            <div className="contactdetailscardbodycol">
              <p>State</p>
              <div className="contactdetailscardbodycolvalue">
                {addresses ? addresses.stateCode : notAvailable}
              </div>
            </div>
            <div className="contactdetailscardbodycol">
              <p>ZIP Code</p>
              <div className="contactdetailscardbodycolvalue">
                {addresses ? addresses.postalCode : notAvailable}
              </div>
            </div>
          </div>
          <hr className="contactdetailscardborder" />
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Email Address (Primary)</p>
              <div className="contactdetailscardbodycolvalue">{emails}</div>
            </div>
          </div>
          <div className="contactdetailscardbodyrowspacing contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Phone</p>
              <div className="contactdetailscardbodycolvalue">
                {phones ? formatPhoneNumber(phones.leadPhone) : notAvailable}
              </div>
            </div>
            <div className="contactdetailscardbodycol">
              <p>Label</p>
              <div className="contactdetailscardbodycolvalue">
                {phones ? phones.phoneLabel : notAvailable}
              </div>
            </div>
          </div>
          <hr className="contactdetailscardborder" />
          <div className="contactdetailscardbodyrow">
            <div className="contactdetailscardbodycol">
              <p>Contact Record Type</p>
              <div className="contactdetailscardbodycolvalue">
                {contactRecordType ? contactRecordType : "Prospect"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="deletecontactsection">
        <button>Delete Contact</button>
      </div>
    </>
  );
};
