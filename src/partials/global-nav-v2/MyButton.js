import React from "react";
import ToggleOffline from "./ToggleOffline.svg";
import ToggleOnline from "./ToggleOnline.svg";
import "./myButton.scss";

function MyButton({ clickButton, isAvailable }) {
  const statusText = isAvailable ? "online" : "offline";
  const handleClick = () => {
    typeof clickButton == "function" && clickButton();
  };
  return (
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
  );
}
export default MyButton;
