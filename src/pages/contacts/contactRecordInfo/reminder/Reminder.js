import React from "react";
import Datepicker from "../../datepicker";

export const ShortReminder = ({ reminder, className }) => {
  const { ReminderDate, ReminderNote } = reminder || {};
  return (
    <div className={`datepicker-row ${className}`}>
      {<Datepicker date={ReminderDate} />}
      {ReminderNote && (
        <label className="datepicker-row short-reminder-note">
          {ReminderNote}
        </label>
      )}
    </div>
  );
};

export default ({ reminder }) => {
  const { ReminderDate } = reminder;
  return (
    <div className="reminderCardSection2">
      <div className="datepicker-row reminderCardSection2row1">
        <Datepicker date={ReminderDate} />
        <label>Last Updated 03/04/2021 1:24 PM EST</label>
      </div>
      <div className="reminderCardSection2row2">
        <div className="reminderCardSection2row2left">
          <p className="alertText">8 Days Overdue </p>
          <p className="normalText">
            Call and ask about quote on Tuesday between 11-2 EST.
          </p>
        </div>
        <div className="reminderCardSection2row2right">
          <button className="complete-btn">Complete</button>
        </div>
      </div>
    </div>
  );
};
