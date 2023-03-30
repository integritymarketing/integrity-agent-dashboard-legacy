import React, { useState } from "react";
import ToggleOffline from "./ToggleOffline.svg";
import ToggleOnline from "./ToggleOnline.svg";
import "./myButton.scss";
import AvailabilityOverlay from "./microComponent/AvailabilityOverlay";

function MyButton({ clickButton, isAvailable, agentID }) {
  const [isCheckInUpdateModalDismissed, setIsCheckInUpdateModalDismissed] =
    useState(
      localStorage.getItem("isCheckInUpdateModalDismissed")
        ? localStorage.getItem("isCheckInUpdateModalDismissed")
        : false
    );
  const [isAvailabiltyModalVisible, setIsAvailabiltyModalVisible] =
    useState(false);
  const statusText = isAvailable ? "online" : "offline";
  const handleClick = () => {
    typeof clickButton == "function" && clickButton();
    if (!isCheckInUpdateModalDismissed) {
      setIsAvailabiltyModalVisible(true);
    }
  };
  return (
    <>
      <div className="myButtonWrapper">
        <span className="myButtonText">I'm Available</span>
        <div className="myButton" onClick={handleClick}>
          {statusText === "offline" && (
            <img
              src={ToggleOffline}
              alt="offButton"
              className={`buttonIcon offButton ${
                statusText === "offline" ? "show" : "hidden"
              }`}
            />
          )}
          <img
            src={ToggleOnline}
            alt="onButton"
            className={`buttonIcon onButton ${
              statusText === "online" ? "show" : "hidden"
            }`}
          />
        </div>
      </div>
      {isAvailabiltyModalVisible && (
        <AvailabilityOverlay
          hideModal={() => {
            setIsAvailabiltyModalVisible(false);
            setIsCheckInUpdateModalDismissed(true);
          }}
        />
      )}
    </>
  );
}
export default MyButton;
