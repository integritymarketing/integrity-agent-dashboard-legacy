import React, { useState } from "react";
import AddReminder from "components/icons/addreminder";
import AddReminderView from "./AddReminder";
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
            <button
              disabled={reminderModalStatus}
              onClick={() => setReminderModalStatus(true)}
            >
              <label>
                <AddReminder />
              </label>
              <span className="add-new-button"> Add New</span>
            </button>
          </div>
        </div>
        <hr />
        {reminderModalStatus && (
          <AddReminderView
            getContactRecordInfo={getContactRecordInfo}
            reminderModalStatus={reminderModalStatus}
            setReminderModalStatus={() => setReminderModalStatus(false)}
            leadId={leadId}
          />
        )}
        {reminders &&
          reminders.length > 0 &&
          reminders.map((item, index) => {
            if (!item.isComplete) {
              return (
                <ViewReminder
                  reminder={item}
                  key={index}
                  leadId={leadId}
                  getContactRecordInfo={getContactRecordInfo}
                />
              );
            } else return null;
          })}
      </div>
    </>
  );
};
