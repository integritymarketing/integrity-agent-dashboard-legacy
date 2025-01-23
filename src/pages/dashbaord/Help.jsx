import React from "react";
import RightArrow from "./vector.png";
import "./help.scss";

export default function Help({ icon, text, labelName, handleClick }) {
  return (
    <div className="dashboard-help-wrapper">
      <img src={icon} className="help-icon" alt=""></img>
      <div className="help-text">
        {text}{" "}
        <a href="# " onClick={handleClick} className="help-click">
          {labelName}&nbsp;&nbsp;
          <img
            onClick={handleClick}
            className="right-arrow"
            src={RightArrow}
            alt="Click here"
          ></img>
        </a>
      </div>
    </div>
  );
}
