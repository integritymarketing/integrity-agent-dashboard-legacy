import React from "react";

export default ({ setDisplay, personalInfo, ...rest }) => {
  let {
    firstName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    contactRecordType = "",
  } = personalInfo;

  emails = emails.length > 0 ? emails[0].leadEmail : "";
  phones = phones.length > 0 ? phones[0] : null;
  addresses = addresses.length > 0 ? addresses[0] : null;

  const city = addresses && addresses.city ? addresses.city : "";
  const stateCode = addresses && addresses.stateCode ? addresses.stateCode : "";
  const postalCode =
    addresses && addresses.postalCode ? addresses.postalCode : "";
  const phone = phones && phones.leadPhone ? phones.leadPhone : "";
  const phoneLabel = phones && phones.phoneLabel ? phones.phoneLabel : "";

  return (
    <div className="contactdetailscard">
      <div className="contactdetailscardheader">
        <h4>Contact Details</h4>
      </div>
      <div className="contactdetailscardbody">
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>First Name</p>
            <div className="contactdetailscardbodycolinput">
              <input type="text" value={firstName} className="" />
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>Last Name</p>
            <div className="contactdetailscardbodycolinput">
              <input type="text" value={lastName} className="" />
            </div>
          </div>
        </div>
        <hr className="contactdetailscardborder" />
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>Address</p>
            <div className="contactdetailscardbodycolinput">
              <input
                type="text"
                value="123 Kingsland Ave."
                className="zero-margin-input"
              />
            </div>
            <div className="addaptbtn">
              <button>+ Add Apt, Suite, Unit etc. </button>
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyinputrowspacing  contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>City</p>
            <div className="contactdetailscardbodycolinput">
              <input type="text" value={city} className="zero-margin-input" />
            </div>
          </div>
          <div className="contactdetailscardbodycol">
            <p>State</p>
            <div className="contactdetailscardbodycolinput">
              <input
                type="text"
                value={stateCode}
                className="custom-w-51 zero-margin-input"
              />
            </div>
          </div>
          <div className="contactdetailscardbodycol">
            <p>ZIP Code</p>
            <div className="contactdetailscardbodycolinput">
              <input
                type="number"
                value={postalCode}
                className="custom-w-83 zero-margin-input"
              />
            </div>
          </div>
        </div>

        <div className="addaptbtn">
          <button>+ Add a different mailing address </button>
        </div>
        <hr className="contactdetailscardborder" />
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>Email Address (Primary)</p>
            <div className="contactdetailscardbodycolinput">
              <input
                type="email"
                value={emails}
                className="zero-margin-input"
              />
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycolradio contactdetailscardbodycol">
            <div>
              <input type="radio" id="test1" name="radio-group" />
              <label for="test1">Primary Communication</label>
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyrowspacing contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>Phone</p>
            <div className="contactdetailscardbodycolinput">
              <input
                type="number"
                value={phone}
                className="custom-w-154 zero-margin-input"
              />
            </div>
          </div>
          <div className="contactdetailscardbodycol">
            <p>Label</p>
            <div className="contactdetailscardbodycolinput">
              <select
                value={phoneLabel}
                className="custom-w-108 zero-margin-input"
              >
                <option value="Phone">Phone</option>
                <option value="Home">Home</option>
              </select>
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycolradio contactdetailscardbodycol">
            <div>
              <input type="radio" id="test1" name="radio-group" />
              <label for="test1">Primary Communication</label>
            </div>
          </div>
        </div>
        <div className="addaptbtn">
          <button>+ Add another phone number </button>
        </div>
        <hr className="contactdetailscardborder" />
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>Contact Record Type</p>
            <div className="contactdetailscardbodycolinput">
              <select
                value={contactRecordType}
                className="custom-w-148 zero-margin-input"
              >
                <option value="Prospect">Prospect</option>
                <option value="Client">Client</option>
              </select>
            </div>
          </div>
        </div>
        <div className="conatctdetailsbutton newnotepopupformfieldbtn form__submit custom-form-btn">
          <button
            className="cancel-btn btn"
            onClick={() => setDisplay("Details")}
          >
            Cancel
          </button>
          <button className="submit-btn btn" type="submit">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
