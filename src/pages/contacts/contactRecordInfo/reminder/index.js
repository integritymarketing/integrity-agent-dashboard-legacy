import React, { useState } from "react";
import AddReminder from "components/icons/addreminder";
import ReminderModal from "./ReminderModal";
import ViewReminder from "./ViewReminder";

export default ({ getContactRecordInfo, leadId, reminders }) => {
  const [reminderModalStatus, setReminderModalStatus] = useState(false);

  return (
    <>
      <div className="reminderCard">
        <div className="reminderCardSection1">
          <div className="reminderCardHeading">
            <h4>Reminders</h4>
          </div>
          <div className="reminderRightSide">
            <button onClick={() => setReminderModalStatus(true)}>
              <label>
                <AddReminder />
              </label>
              <span> Add New</span>
            </button>
          </div>
        </div>
        <hr />
        {reminders &&
          reminders.length > 0 &&
          reminders.map((item, index) => {
            return (
              <ViewReminder
                reminder={item}
                key={index}
                leadId={leadId}
                getContactRecordInfo={getContactRecordInfo}
              />
            );
          })}
      </div>
      <ReminderModal
        getContactRecordInfo={getContactRecordInfo}
        reminderModalStatus={reminderModalStatus}
        setReminderModalStatus={() => setReminderModalStatus(false)}
        leadId={leadId}
      />
    </>
  );
};
