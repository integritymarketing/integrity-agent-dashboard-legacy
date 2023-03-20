import React from "react";
import ToggleOffline from "./ToggleOffline.svg";
import ToggleOnline from "./ToggleOnline.svg";
import "./myButton.scss";

const BUTTON_TEXT = {
  offline: "Check In",
  online: "Check Out",
};

function MyButton({ clickButton, isAvailable }) {
  const statusText = isAvailable ? "online" : "offline";
  const handleClick = () => {
    typeof clickButton == "function" && clickButton();
  };
  return (
    <>
      <div className="myButton" onClick={handleClick}>
        {statusText === "offline" && (
          <img
            src={ToggleOffline}
            alt="offButton"
            className={`buttonIcon  ${
              statusText === "offline" ? "show" : "hidden"
            }`}
          />
        )}
        <span className={` ${statusText === "online" ? "ml-2" : ""}`}>
          {BUTTON_TEXT[statusText]}
        </span>
        <img
          src={ToggleOnline}
          alt="onButton"
          className={`buttonIcon ${
            statusText === "online" ? "show" : "hidden"
          }`}
        />
      </div>
    </>
  );
}
export default MyButton;
