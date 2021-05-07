import React from "react";

export default ({ setDisplay, ...rest }) => {
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
              <input type="text" value="Victoria" className="" />
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyrow">
          <div className="contactdetailscardbodycol">
            <p>Last Name</p>
            <div className="contactdetailscardbodycolinput">
              <input type="text" value="Garcia" className="" />
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
              <input
                type="text"
                value="Brooklyn"
                className="zero-margin-input"
              />
            </div>
          </div>
          <div className="contactdetailscardbodycol">
            <p>State</p>
            <div className="contactdetailscardbodycolinput">
              <input
                type="text"
                value="NY"
                className="custom-w-51 zero-margin-input"
              />
            </div>
          </div>
          <div className="contactdetailscardbodycol">
            <p>ZIP Code</p>
            <div className="contactdetailscardbodycolinput">
              <input
                type="number"
                value="11222"
                className="custom-w-83 zero-margin-input"
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
                value="victoriagarcia@email.com"
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
                value="8905671234"
                className="custom-w-154 zero-margin-input"
              />
            </div>
          </div>
          <div className="contactdetailscardbodycol">
            <p>Label</p>
            <div className="contactdetailscardbodycolinput">
              <select className="custom-w-108 zero-margin-input">
                <option></option>
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
              <select className="custom-w-148 zero-margin-input">
                <option>Prospect</option>
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
