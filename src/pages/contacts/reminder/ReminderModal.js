import React, { useState } from "react";
import Modal from "components/ui/modal";
import AddReminder from "components/icons/addreminder";
import Datepicker from "../datepicker";

export default ({ reminderModalStatus, setReminderModalStatus, ...props }) => {
  const [reminders, addReminder] = useState([0]);
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
          <a
            href="#/"
            onClick={() => addReminder([...reminders, reminders.length])}
          >
            <label>
              <AddReminder />
            </label>{" "}
            <span>New</span>
          </a>
        </div>
        {reminders &&
          reminders.map((item, index) => {
            return (
              <div className="reminderCardSection2">
                <div className="reminderCardSection2row1">
                  <Datepicker />
                </div>
                <div className="reminderCardSection2row2">
                  <div className="reminderCardSection2row2left">
                    <p className="normalText">Follow up with Humana.</p>
                  </div>
                  <div className="reminderCardSection2row2right">
                    <button className="complete-btn">Complete</button>
                  </div>
                </div>
              </div>
            );
          })}

        {/* <div className="reminderCardSection2">
          <div className="reminderCardSection2row1">
          <Datepicker />
          </div>
          <div className="reminderCardSection2row2">
            <div className="reminderCardSection2row2left">
              <textarea
                value=""
                className="inputText"
                rows="3"
              ></textarea>
            </div>
            <div className="reminderCardSection2row2right">
              <button className="complete-btn">Complete</button>
            </div>
          </div>
        </div>
        <div className="reminderCardSection2 active">
          <div className="reminderCardSection2row1">
        <Datepicker />
          </div>
          <div className="reminderCardSection2row2">
          <div className="reminderCardSection2row2left">
              <textarea
                value=""
                className="inputText"
                rows="3"
              ></textarea>
            </div>
            <div className="reminderCardSection2row2right">
              <button className="complete-btn">Complete</button>
            </div>
          </div>
        </div> */}
        <div className="reminder-modal-footer">
          <button className="reminder-cancel-btn">Cancel</button>
          <button className="reminder-save-btn">Save</button>
        </div>
      </Modal>
    </div>
  );
};
