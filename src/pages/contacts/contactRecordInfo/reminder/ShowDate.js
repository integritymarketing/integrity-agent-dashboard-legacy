import React, { useEffect, useState } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import ReminderIcon from "../../../../stories/assets/reminder.svg";
import format from "date-fns/format";

export default ({ date, setDate, placeholder, isEdit = true }) => {
  const [dateStatus, setDateStatus] = useState(false);
  const handleClick = () => {
    if (isEdit) {
      setDateStatus(true);
    } else {
      setDateStatus(false);
    }
  };

  useEffect(() => {
    if (!isEdit) {
      setDateStatus(false);
    }
  }, [isEdit]);

  return (
    <span className="datepickerparent">
      <div className="cal" onClick={handleClick}>
        <img src={ReminderIcon} alt="" height="20" className="mr-1" />
        <span className="datetext">
          {date
            ? format(new Date(date), "M/dd")
            : placeholder || format(new Date(), "M/dd")}
        </span>
      </div>
      {dateStatus && (
        <DayPicker
          selectedDays={date}
          format={"MM/DD"}
          onDayClick={(date) => {
            setDate && setDate(date);
            setDateStatus(false);
          }}
        />
      )}
    </span>
  );
};
