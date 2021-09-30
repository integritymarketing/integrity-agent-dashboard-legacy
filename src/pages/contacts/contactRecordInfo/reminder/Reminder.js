import React, { useEffect } from "react";
import Datepicker from "../../datepicker";
import ReminderModal from "./ReminderModal";
import analyticsService from "services/analyticsService";
import { getOverDue } from "utils/dates";

export const ShortReminder = ({
  leadId,
  reminders = [],
  className,
  onRefresh,
  isCardView = false,
  showAddModal,
  setShowAddModal,
  showAddNewModal,
}) => {
  const reminder = !showAddNewModal
    ? reminders.find((reminder) => !reminder.isComplete) || {}
    : {};
  const { reminderDate, reminderNote } = reminder;
  useEffect(() => {
    if(showAddModal) {
    analyticsService.fireEvent("event-date-edit");
  }
  }, [showAddModal]);

  return (
    <div className={`reminder-content datepicker-row ${className}`}>
      {
        <Datepicker
          date={reminderDate}
          overDueStatus={getOverDue(reminderDate) ? true : false}
          onAddNew={(e) => {
            e.stopPropagation();
            setShowAddModal(true);
          }}
        />
      }
      <div className="reminder-inner-content">
        {getOverDue(reminderDate) && (
          <div className={`due-date-text ${isCardView ? "card-view" : ""}`}>
            {getOverDue(reminderDate)}
          </div>
        )}
        {reminderNote && (
          <div className="short-reminder-note">{reminderNote}</div>
        )}
      </div>
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
