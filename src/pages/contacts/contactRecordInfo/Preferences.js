import React from "react";

export default () => {
  return (
    <div className="contactdetailscard">
      <div className="contactdetailscardheader">
        <h4>Communication Preferences</h4>
      </div>
      <div className="contactdetailscardbody">
        <div className="contactdetailscardbodyrow">
          <div className="cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input type="checkbox" id="test" name="checkbox-group" />
              <label for="test">Email</label>
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyrow">
          <div className="cpradiodesign contactdetailscardbodycolradio contactdetailscardbodycol">
            <div>
              <input type="radio" id="test1" name="radio-group" />
              <label for="test1">Primary Communication</label>
            </div>
          </div>
        </div>
        <hr className="contactdetailscardborder" />
        <div className="contactdetailscardbodyrow">
          <div className="cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input type="checkbox" id="test" name="checkbox-group" />
              <label for="test">Phone Calls</label>
            </div>
          </div>
        </div>
        <div className="contactdetailscardbodyrow">
          <div className="cpradiodesign contactdetailscardbodycolradio contactdetailscardbodycol">
            <div>
              <input type="radio" id="test1" name="radio-group" />
              <label for="test1">Primary Communication</label>
            </div>
          </div>
        </div>
        <hr className="contactdetailscardborder" />
        <div className="contactdetailscardbodyrow">
          <div className="custom-inputmargin cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input type="checkbox" id="test" name="checkbox-group" />
              <label for="test">Text Messaging</label>
            </div>
          </div>
        </div>
        <hr className="contactdetailscardborder" />
        <div className="contactdetailscardbodyrow">
          <div className="custom-inputmargin cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input type="checkbox" id="test" name="checkbox-group" />
              <label for="test">Mail</label>
            </div>
          </div>
        </div>
        <hr className="contactdetailscardborder" />
        <div className="contactdetailscardbodyrow">
          <div className="custom-inputmargin cpcheckboxdesign contactdetailscardbodycol">
            <div>
              <input type="checkbox" id="test" name="checkbox-group" />
              <label for="test">Do Not Call / Lost Contact</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
