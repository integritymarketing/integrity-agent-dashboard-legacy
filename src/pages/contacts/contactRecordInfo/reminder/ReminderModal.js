import React, { useState } from "react";
import Modal from "components/ui/modal";
import ShowDate from "./ShowDate";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import useToast from "../../../../hooks/useToast";

export default ({
  reminderModalStatus,
  setReminderModalStatus,
  getContactRecordInfo,
  leadId,
  reminder,
  ...props
}) => {
  const [reminderNote, setReminderNote] = useState(
    (reminder && reminder.reminderNote) || ""
  );
  const [reminderDate, setReminderDate] = useState(
    (reminder && reminder.reminderDate) || new Date()
  );

  const isEdit = reminder && reminder.reminderId;
  const addToast = useToast();

  const saveReminder = async () => {
    const payload = {
      reminderNote,
      reminderDate,
      leadsId: leadId,
    };
    clientsService
      .createReminder(payload)
      .then((data) => {
        addToast({
          type: "success",
          message: "Reminder successfully added.",
          time: 3000,
        });
        setReminderNote("");
        setReminderDate(new Date());
        setReminderModalStatus();
        getContactRecordInfo();
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };

  const updateReminder = (complete) => {
    let payload = {
      ...reminder,
      reminderNote,
      reminderDate,
      leadId,
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
        setReminderModalStatus();
        getContactRecordInfo();
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };

  const isComplete = reminder && reminder.isComplete;

  return (
    <div className="custom-reminder-modal customform">
      <Modal
        open={reminderModalStatus}
        onClose={setReminderModalStatus}
        labeledById="dialog_contact_label"
      >
        <div className="reminder-modal-heading">
          <legend
            className=" custom-modal-heading hdg hdg--2 mb-1"
            id="dialog_contact_label"
          >
            <label> Reminder</label>
          </legend>
        </div>
        <div className="reminderCardSection2">
          <div className="reminderCardSection2row1">
            <ShowDate date={reminderDate} setDate={setReminderDate} />
          </div>
          <div className="reminderCardSection2row2">
            <div className="reminderCardSection2row2left full-width">
              <div style={{ display: "flex" }}>
                <textarea
                  value={reminderNote}
                  placeholder="Please Enter Here.."
                  className="normalText"
                  rows="3"
                  onChange={(e) => setReminderNote(e.target.value)}
                ></textarea>
                {isEdit && !isComplete && (
                  <button
                    className="complete-btn"
                    onClick={() => {
                      updateReminder(true);
                    }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="reminder-modal-footer">
          <button
            className="reminder-cancel-btn"
            onClick={() => setReminderModalStatus()}
          >
            Cancel
          </button>
          <button
            className="reminder-save-btn"
            onClick={() => {
              if (isEdit) {
                updateReminder();
              } else {
                saveReminder();
              }
            }}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};
