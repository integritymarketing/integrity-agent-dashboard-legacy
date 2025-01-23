import React from "react";
import "./modalText.scss";

function CheckOut() {
  return (
    <div>
      <div className="modalTextTop">
        <span className="modalTextOffline">You are Offline</span>
      </div>

      <div className="modalTextStyle">
        <span>Check back in anytime to start </span>
        <span>receiving active leads.</span>
      </div>
    </div>
  );
}
export default CheckOut;
