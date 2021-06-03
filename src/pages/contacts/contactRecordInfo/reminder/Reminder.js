import React, { useEffect } from "react";
import Datepicker from "../../datepicker";
import ReminderModal from "./ReminderModal";
import analyticsService from "services/analyticsService";

export const ShortReminder = ({ leadId, reminders, className, onRefresh }) => {
  const reminder = (reminders || []).find((rem) => !rem.isComplete) || {};
  const { reminderDate, reminderNote } = reminder || {};
  const [showAddModal, setShowAddModal] = React.useState(false);
  useEffect(() => {
    analyticsService.fireEvent("event-date-edit");
  }, []);
  return (
    <div className={`datepicker-row ${className}`}>
      {
        <Datepicker
          date={reminderDate}
          onAddNew={(e) => {
            e.stopPropagation();
            setShowAddModal(true);
          }}
        />
      }
      {reminderNote && (
        <label className="datepicker-row short-reminder-note">
          {reminderNote}
        </label>
      )}
      {showAddModal && (
        <ReminderModal
          reminder={reminder}
          getContactRecordInfo={onRefresh}
          reminderModalStatus={showAddModal}
          setReminderModalStatus={() => setShowAddModal(false)}
          leadId={leadId}
        />
      )}
    </div>
  );
};

export default ({ reminder }) => {
  const { reminderDate } = reminder;
  return (
    <div className="reminderCardSection2">
      <div className="datepicker-row reminderCardSection2row1">
        <Datepicker date={reminderDate} />
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
