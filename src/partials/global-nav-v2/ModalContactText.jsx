import React from "react";

import { formatPhoneNumber } from "utils/phones";

import "./modalText.scss";

const MODAL_TEXT = {
    TITLE: "Contact",
    BACK_TITLE: "Check In",
};

function ModalContactText({ virtualNumber }) {
    return (
        <div>
            <div className="modalTextTop">
                <span className="modalTextFont">{MODAL_TEXT.TITLE}</span>
            </div>

            <div className="modalTextStyle">
                <span>Your Integrity number</span>
            </div>
            <div className="modalTextNum">
                <span>{formatPhoneNumber(virtualNumber, true)}</span>
            </div>

            <div className="modalTextStyle">
                <span>Calls to your Integrity number</span>
                <span> will be forwarded to the number</span>
                <span> below and will be recorded. </span>
            </div>
        </div>
    );
}
export default ModalContactText;
