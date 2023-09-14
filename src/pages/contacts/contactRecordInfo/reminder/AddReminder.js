import React, { useState } from "react";
import PropTypes from "prop-types";
import ShowDate from "./ShowDate";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import useToast from "../../../../hooks/useToast";

const AddReminder = ({
  reminderModalStatus,
  setReminderModalStatus,
  getLeadDetails,
  leadId,
}) => {
  const [reminderNote, setReminderNote] = useState("");
  const [reminderDate, setReminderDate] = useState(null);
  const addToast = useToast();

  const saveReminder = async () => {
    const payload = {
      reminderNote,
      reminderDate,
      leadsId: leadId,
    };
    try {
      await clientsService.createReminder(payload);
      addToast({
        type: "success",
        message: "Reminder successfully added.",
        time: 3000,
      });
      setReminderNote("");
      setReminderDate(new Date());
      setReminderModalStatus();
      getLeadDetails();
    } catch (e) {
      Sentry.captureException(e);
    }
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
            maxLength={256}
            value={reminderNote}
            placeholder="Please Enter Here.."
            className="normalText"
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

AddReminder.propTypes = {
  reminderModalStatus: PropTypes.bool.isRequired,
  setReminderModalStatus: PropTypes.func.isRequired,
  getLeadDetails: PropTypes.func.isRequired,
  leadId: PropTypes.string.isRequired,
};

export default AddReminder;
