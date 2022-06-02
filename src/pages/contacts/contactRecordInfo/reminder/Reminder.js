import React, { useEffect } from "react";
import Datepicker from "../../datepicker";
import ReminderModal from "./ReminderModal";
import analyticsService from "services/analyticsService";
import { getOverDue } from "utils/dates";
import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";
import Reminder_Add from "images/Reminder_Add.svg";
import styles from "../../ContactsPage.module.scss";
import format from "date-fns/format";

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
    if (showAddModal) {
      analyticsService.fireEvent("event-date-edit");
    }
  }, [showAddModal]);

  return (
    <div className={`reminder-content datepicker-row ${className}`}>
      {reminderDate ? (
        <div className={styles.reminderRow}>
          <span
            className={styles.reminderAction}
            onClick={() => setShowAddModal(true)}
          >
            <img
              className={styles.reminderIcon}
              src={getOverDue(reminderDate) ? Reminder_Overdue : ReminderIcon}
              alt="rem"
            />
            <span
              className={
                getOverDue(reminderDate)
                  ? styles.dueReminder
                  : styles.reminderDate
              }
            >
              {format(new Date(reminderDate), "MM/dd")}
              {!isCardView && ":"}
            </span>
          </span>
          {!isCardView && (
            <span className={styles.reminderNote}>{reminderNote}</span>
          )}
        </div>
      ) : (
        <img className={styles.reminderIcon} src={Reminder_Add} alt="rem" />
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
