import React from "react";
import "./modalText.scss";

const MODAL_TEXT = {
  TITLE: "You are checked in",
};

function ModalText() {
  return (
    <div>
      <div className="modalTextTop">
        <span className="modalTextFont">{MODAL_TEXT.TITLE}</span>
      </div>

      <div className="modalTextStyle">
        <span>Thanks for checking in you should be</span>
        <span>receiving leads shortly.</span>
      </div>
    </div>
  );
}
export default ModalText;
