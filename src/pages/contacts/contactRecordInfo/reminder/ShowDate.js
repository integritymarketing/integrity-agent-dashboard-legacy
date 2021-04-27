import React, { useState } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import ReminderIcon from "../../../../stories/assets/reminder.svg";
import format from 'date-fns/format';

 export default ({date, setDate}) => {
  const [dateStatus, setDateStatus] = useState(false);

  
  return (
    <span className="datepickerparent">
      <div className="cal" onClick={() => setDateStatus(!dateStatus)}>
        <img src={ReminderIcon} alt="" height="20" className="mr-1" />
        <span className='datetext'>{date ? format(new Date(date), 'M/dd') : format(new Date(), 'M/dd')}</span>
      </div>
      {dateStatus &&  
      <DayPicker
          selectedDays={date}
          format={"MM/DD"}
          onDayClick={(date) => {
            setDate && setDate(date);
            setDateStatus(false)
          }}
        />}

    </span>
  );
};
