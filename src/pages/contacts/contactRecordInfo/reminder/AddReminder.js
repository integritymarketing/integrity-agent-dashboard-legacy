import React, { useState } from "react";
import ShowDate from "./ShowDate";
import { useClientServiceContext } from "services/clientServiceProvider";
import * as Sentry from "@sentry/react";
import useToast from "../../../../hooks/useToast";

export default ({
  reminderModalStatus,
  setReminderModalStatus,
  getLeadDetails,
  leadId,
  ...props
}) => {
  const [reminderNote, setReminderNote] = useState("");
  const [reminderDate, setReminderDate] = useState(null);
  const addToast = useToast();
  const { clientsService } = useClientServiceContext();

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
        getLeadDetails();
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };

  return (
    <div className="reminderCardSection2">
      <div className="reminderCardSection2row1">
        <ShowDate
          date={reminderDate}
          placeholder="Date"
          setDate={setReminderDate}
        />
      </div>
      <div>
        <div className="reminderCardSection2row2left">
          <textarea
            value={reminderNote}
            placeholder="Please Enter Here.."
            className="normalText"
            style={{ height: "auto" }}
            rows="3"
            onChange={(e) => setReminderNote(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="reminderCardSection2row2">
        <div />
        <div className="remindercardsectioncancelsavebtn reminderCardSection2row2right">
          <button
            className="reminder-cancel-btn"
            onClick={() => setReminderModalStatus()}
          >
            Cancel
          </button>
          <button
            disabled={!reminderDate || !reminderNote}
            className="reminder-save-btn"
            onClick={saveReminder}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
