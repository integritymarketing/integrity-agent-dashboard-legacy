import React from "react";
import "./modalText.scss";

const MODAL_TEXT = {
  TITLE: "You are checked in",
};

function ModalText({ checkInPreference }) {
  return (
    <div className={`${checkInPreference ? "checkInPref" : ""}`}>
      <div className="modalTextTop">
        <span className={"modalTextFont"}>
          {checkInPreference ? "Check-in preferences" : MODAL_TEXT.TITLE}
        </span>
      </div>

      {!checkInPreference && (
        <div className="modalTextStyle">
          <span>Thanks for checking in you should be</span>
          <span>receiving leads shortly.</span>
        </div>
      )}
    </div>
  );
}
export default ModalText;
