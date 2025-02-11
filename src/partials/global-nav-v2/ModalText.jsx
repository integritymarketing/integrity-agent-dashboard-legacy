import React from "react";

import "./modalText.scss";

const MODAL_TEXT = {
    TITLE: "Confirm Check In",
};

function ModalText({ checkInPreference }) {
    return (
        <div className={`${checkInPreference ? "checkInPref" : ""}`}>
            <div className="modalTextTop">
                <span className={"modalTextFont"}>{checkInPreference ? "Check-in preferences" : MODAL_TEXT.TITLE}</span>
            </div>

            {!checkInPreference && (
                <div className="modalTextStyle">
                    <span className="text-info">
                        To finish checking in, verify the information below and then click continue.
                    </span>
                    <span className="text-info">
                        Be sure to answer any calls from the Integrity Virtual Operator* number below and store it as a
                        contact in your phone.
                    </span>
                    <span className="text-info phne-num">254-271-0085</span>
                </div>
            )}
        </div>
    );
}
export default ModalText;
