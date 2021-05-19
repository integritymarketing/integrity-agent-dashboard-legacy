import React, { useState } from "react";
import BellIcon from "components/icons/bell-note";
import { getForDistance } from "utils/dates";
import LimitedCharacters from "./limitedCharacters";
import clientsService from "services/clientsService";

const charactersSize = 150;
export default ({
  activityBody,
  activitySubject,
  createDate,
  modifyDate,
  activityId,
  editActivity,
  ...props
}) => {
  return (
    <div
      className="activityCardbodyset"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="iconTime">
        <span className="bg-color bg-color1">
          <BellIcon />
        </span>
        <label>
          {modifyDate ? getForDistance(modifyDate) : getForDistance(createDate)}
        </label>
      </p>
      <h6>{activitySubject}</h6>
      <div className="para-btn-section">
        <p></p>
        {/* <button className="view-btn">View SOA</button> */}
        {hovered && (
          <div className="datepicker-row reminderCardSection2row1of1">
            <button
              className="deletetextareatext"
              onClick={() => deleteActivity()}
            >
              Delete
            </button>
            <button className="edittextareatext" onClick={() => editActivity}>
              Edit
            </button>
          </div>
        )}
      </div>
      <hr className="bodylineseparation" />
    </div>
  );
};
