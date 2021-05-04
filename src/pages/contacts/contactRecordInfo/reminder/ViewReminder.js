import React, { useState, useRef, useEffect } from "react";
import ShowDate from "./ShowDate";
import format from "date-fns/format";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import useToast from "../../../../hooks/useToast";

export default ({ reminder, leadId, getContactRecordInfo }) => {
  const {
    reminderNote = "",
    reminderDate = null,
    isComplete = false,
    reminderId,
  } = reminder;
  const inputRef = useRef(null);

  const [date, setDate] = useState(null);
  const [updatedReminder, setReminderNote] = useState(reminderNote);
  const [isEdit, setEdit] = useState(false);
  const [reminderHovered, setReminderHovered] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    if (isEdit) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const updateReminder = (complete) => {
    let payload = {
      ...reminder,
      reminderNote: updatedReminder,
      reminderDate: date,
      leadId: leadId,
    };
    if (complete) {
      payload.isComplete = true;
    }
    clientsService
      .updateReminder(payload)
      .then((data) => {
        addToast({
          type: "success",
          message: "Reminder successfully Updated.",
          time: 3000,
        });
        setEdit(false);
        getContactRecordInfo();
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };

  const deleteReminder = async () => {
    await clientsService.deleteReminder(reminderId);
    getContactRecordInfo();
    addToast({
      type: "success",
      message: "Reminder successfully deleted",
      time: 3000,
    });
    setEdit(false);
  };

  return (
    <div
      className={`reminderCardSection2 reminderCardSection2${
        reminderHovered ? "-activeborder" : ""
      }${isEdit ? " edittextarea-active" : ""}`}
      onMouseEnter={() => setReminderHovered(true)}
      onMouseLeave={() => setReminderHovered(false)}
    >
      <div className="wholereminderCardSection2row1of1">
        <div className="custom-datepicker-active border datepicker-row reminderCardSection2row1">
          <ShowDate date={date} setDate={setDate} />
          <label>
            Last Updated{" "}
            {reminder.modifyDate
              ? format(new Date(reminder.modifyDate), "yyyy-MM-dd HH:MM a")
              : format(new Date(reminder.createDate), "yyyy-MM-dd HH:MM a")}
          </label>
        </div>
        {!isEdit && reminderHovered && (
          <div className="datepicker-row reminderCardSection2row1of1">
            <button
              className="deletetextareatext"
              onClick={() => deleteReminder()}
            >
              Delete
            </button>
            <button className="edittextareatext" onClick={() => setEdit(true)}>
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="">
        <div className="reminderCardSection2row2left">
          {/* <p className="alertText">8 Days Overdue </p> */}
          <div className="reminderCardSection2row2left">
            {isEdit ? (
              <textarea
                ref={inputRef}
                value={updatedReminder}
                placeholder="Please Enter Here.."
                className="inputText"
                rows="3"
                onChange={(e) => setReminderNote(e.target.value)}
              ></textarea>
            ) : (
              <p className="normalText">{reminder.reminderNote}</p>
            )}
          </div>
        </div>
      </div>
      <div className="reminderCardSection2row2">
        <div className="reminderCardSection2row2left">
          {isEdit && <button onClick={() => deleteReminder()}>Delete</button>}
        </div>

        <div className="remindercardsectioncancelsavebtn reminderCardSection2row2right">
          {!isEdit && !isComplete && (
            <button
              className="complete-btn"
              onClick={() => {
                updateReminder(true);
              }}
            >
              Complete
            </button>
          )}
          {isEdit && (
            <>
              <button
                className="reminder-cancel-btn"
                onClick={() => {
                  setReminderNote(reminderNote);
                  setEdit(false);
                }}
              >
                Cancel
              </button>
              <button className="reminder-save-btn" onClick={updateReminder}>
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
