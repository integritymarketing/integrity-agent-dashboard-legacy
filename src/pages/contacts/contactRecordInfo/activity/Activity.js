import React from "react";
import BellIcon from "components/icons/bell-note";

export default () => {
   return (
    <div className="activityCardbodyset">
      <p className="iconTime">
        <span className="bg-color bg-color1">
          <BellIcon />
        </span>
        <label>03/04/2021 1:24 PM EST</label>
      </p>
      <h6>SOA Signed</h6>
      <div className="para-btn-section">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
          <a href="#">View More</a>
        </p>
        <button className="view-btn">View SOA</button>
      </div>
      <hr className="bodylineseparation" />
    </div>
  );
};
