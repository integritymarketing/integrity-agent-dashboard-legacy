import React, { useState } from "react";
import AddReminder from "components/icons/addreminder";
import ReminderModal from "./ReminderModal";
import Datepicker from "../../datepicker";
import Reminder from "./Reminder";

export default () => {
  const [reminderModalStatus, setReminderModalStatus] = useState(false);

  return (
    <>
      <div className="reminderCard">
        <div className="reminderCardSection1">
          <div className="reminderCardHeading">
            <h4>Reminders</h4>
          </div>
          <div className="reminderRightSide">
            <a
              href="JavaScript:void(0);"
              onClick={() => setReminderModalStatus(true)}
            >
              <label>
                <AddReminder />
              </label>
              <span>New Reminder</span>
            </a>
          </div>
        </div>
        <hr />
      {[1, 2, 3].map((item, index) => {
        return(
          <Reminder key={index} />
        )
      })
    }
     
      </div>
      <ReminderModal
        reminderModalStatus={reminderModalStatus}
        setReminderModalStatus={() => setReminderModalStatus(false)}
      />
    </>
  );
};
