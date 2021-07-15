import React from "react";
import ScopeSendIcon from "components/icons/scope-send";

export default ({ setDisplay, ...rest }) => {
  return (
    <>
      <div className="contactdetailscard">
        <div className="scope-details-card-header contactdetailscardheader">
          <h4>Scope of Appointment</h4>
          <button className="send-btn">
            <ScopeSendIcon />
            <span>Send</span>
          </button>
        </div>
        <div className="contactdetailscardbody">
          <div className="scope-of-app-row">
            <div className="scope-of-app-row-section1">
              <p>
                Signed <span>03/02/2021</span>
              </p>
            </div>
            <div className="scope-of-app-row-section2">
              <p>The scope of appointment is ready for ready for review. </p>
              <button className="complete-btn">Complete</button>
            </div>
          </div>
          <div className="scope-of-app-row">
            <div className="scope-of-app-row-section1">
              <p>
                Sent <span>03/02/2021</span>
              </p>
            </div>
            <div className="scope-of-app-row-section2">
              <p>The scope of appointment is ready for ready for review. </p>
            </div>
          </div>
          <div className="scope-of-app-row">
            <div className="scope-of-app-row-section1">
              <p className="completed-text">
                Completed <span>03/02/2021</span>
              </p>
            </div>
            <div className="completed-text-row scope-of-app-row-section2">
              <ul>
                <li>Ancillary Products</li>
                <li>Ancillary Products</li>
                <li>Ancillary Products</li>
              </ul>
              <button className="view---btn">View</button>
            </div>
          </div>
          <div className="scope-of-app-row-show-more">
            <button className="show--more--btn">Show More</button>
          </div>
        </div>
      </div>
    </>
  );
};
