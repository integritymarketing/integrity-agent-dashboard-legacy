import React, { useState } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import ReminderIcon from "../../stories/assets/reminder.svg";

export default () => {
  const [dateStatus, setDateStatus] = useState(false);
  return (
    <span className="datepickerparent">
      <div className="cal" onClick={() => setDateStatus(!dateStatus)}>
        <img src={ReminderIcon} alt="" height="20" className="mr-1" />
        3/15
      </div>
      {dateStatus && <DayPicker />}
    </span>
  );
};
