import React, { useState } from "react";
import AddReminder from "components/icons/addreminder";
import AddReminderView from "./AddReminder";
import ViewReminder from "./ViewReminder";

const Reminder = ({ getLeadDetails, leadId, reminders, isMobile }) => {
  const [reminderModalStatus, setReminderModalStatus] = useState(false);

  return (
    <>
      <div className="reminderCard" data-gtm="contact-record-reminder-section">
        <div className="reminderCardSection1">
          <div className="reminderCardHeading">
            <h4>Reminders</h4>
          </div>
          <div
            className="reminderRightSide"
            data-gtm="contact-record-new-reminder-button"
          >
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
            getLeadDetails={getLeadDetails}
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
                  getLeadDetails={getLeadDetails}
                  isMobile={isMobile}
                />
              );
            } else return null;
          })}
      </div>
    </>
  );
};

export default Reminder;
