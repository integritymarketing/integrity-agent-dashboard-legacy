import React, { useState } from "react";
import AddNote from "components/icons/add-note";
import EditNote from "components/icons/edit-note";
import DeleteNote from "components/icons/delete";
import BellIcon from "components/icons/bell-note";
import SuccessIcon from "components/icons/success-note";
import WarningIcon from "components/icons/warning-note";
import AddReminder from "components/icons/addreminder";
import ActivityModal from "./ActivityModal";
import ReminderModal from "../reminder/ReminderModal";
import { Select } from "components/ui/Select";
import Datepicker from "../datepicker";

export const SORT_OPTIONS = [
  { value: "one", label: "one" },
  { value: "two", label: "two" },
  { value: "three", label: "three" },
];

const PersonalInfo = () => {
  return (
    <div className="nameCard">
      <div className="nameCardSection1">
        <div className="nameCardHeading">
          <h2>Victoria Garcia</h2>
        </div>
        <div className="nameCardpara">
          <h2>Client | Last updated 02/04/2021</h2>
        </div>
      </div>
      <hr />
      <div className="nameCardSection2">
        <div className="personalInfo">
          <label>
            Email <span className="italic-label">(Primary)</span>
          </label>
          <div className="personalInfoEmailText">
            victoriagarcia_12345@email.com
          </div>
        </div>
        <div className="personalInfo">
          <label>Phone</label>
          <div className="personalInfoText">(890) 567-1234</div>
        </div>
        <div className="personalInfo">
          <label>Stage</label>
          <div className="">
            <Select
              placeholder={"Stage"}
              options={SORT_OPTIONS}
              onChange={() => {}}
            />
          </div>
        </div>
        <div className="personalInfo">
          <label>Address</label>
          <div className="personalInfoText">
            123 Kingsland Avenue, 3R <br />
            Brooklyn, NY 11222
          </div>
        </div>
      </div>
    </div>
  );
};

const Reminders = ({ setReminderModalStatus }) => {
  return (
    <div className="reminderCard">
      <div className="reminderCardSection1">
        <div className="reminderCardHeading">
          <h4>Reminders</h4>
        </div>
        <div className="reminderRightSide">
          <a href="#/" onClick={() => setReminderModalStatus(true)}>
            <label>
              {" "}
              <AddReminder />
            </label>{" "}
            <span>New Reminder</span>
          </a>
        </div>
      </div>
      <hr />
      <div className="reminderCardSection2">
        <div className="datepicker-row reminderCardSection2row1">
          <Datepicker />
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
      <div className="reminderCardSection2">
        <div className="reminderCardSection2row1">
          <Datepicker />
          <label>Last Updated 03/04/2021 1:24 PM EST</label>
        </div>
        <div className="reminderCardSection2row2">
          <div className="reminderCardSection2row2left">
            <p className="normalText">
              Call and ask about quote on Tuesday between 11-2 EST.
            </p>
          </div>
          <div className="reminderCardSection2row2right">
            <button className="complete-btn">Complete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Activities = ({ setActivityModalStatus }) => {
  return (
    <div className="activityCard">
      <div className="activityCardHeader">
        <h4>Activity</h4>
        <p className="notetext" onClick={() => setActivityModalStatus(true)}>
          <span>
            <AddNote />
          </span>
          <label>New Note</label>
        </p>
      </div>
      <hr className="headerlineseparation" />
      <div className="activityCardbody">
        <div className="activityCardbodyset">
          <p className="iconTime">
            <span className="bg-color bg-color1">
              <BellIcon />
            </span>
            <label>03/04/2021 1:24 PM EST</label>
          </p>
          <h6>SOA Signed</h6>
          <div className="para-btn-section">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
              <a href="#/">View More</a>
            </p>
            <button className="view-btn">View SOA</button>
          </div>
          <hr className="bodylineseparation" />
        </div>
        <div className="activityCardbodyset">
          <div className="edit-delete-row">
            <p className="iconTime">
              <span className=" bg-color bg-color2">
                <SuccessIcon />
              </span>
              <label>03/04/2021 1:24 PM EST</label>
            </p>
            <div className="edit-delete-btn">
              <a href="#/">
                <DeleteNote />
              </a>
              <a href="#/">
                <EditNote />
              </a>
            </div>
          </div>
          <h6>SOA Signed</h6>
          <div className="para-btn-section">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
              <a href="#/">View More</a>
            </p>
            <button className="view-btn">View SOA</button>
          </div>
          <hr className="bodylineseparation" />
        </div>
        <div className="activityCardbodyset">
          <p className="iconTime">
            <span className="bg-color bg-color3">
              <WarningIcon />
            </span>
            <label>03/04/2021 1:24 PM EST</label>
          </p>
          <h6>SOA Signed</h6>
          <div className="para-btn-section">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
              <a href="#/">View More</a>
            </p>
            <button className="view-btn">View SOA</button>
          </div>
          <hr className="bodylineseparation" />
        </div>
      </div>
      <div className="activityCardfooter">
        <p>Show 5 More</p>
      </div>
    </div>
  );
};

export default () => {
  const [activityModalStatus, setActivityModalStatus] = useState(false);
  const [reminderModalStatus, setReminderModalStatus] = useState(false);

  return (
    <>
      <div className="rightSection">
        <PersonalInfo />
        <Reminders
          reminderModalStatus={reminderModalStatus}
          setReminderModalStatus={setReminderModalStatus}
        />
        <Activities setActivityModalStatus={setActivityModalStatus} />
      </div>
      <ActivityModal
        activityModalStatus={activityModalStatus}
        setActivityModalStatus={() => setActivityModalStatus(false)}
      />
      <ReminderModal
        reminderModalStatus={reminderModalStatus}
        setReminderModalStatus={() => setReminderModalStatus(false)}
      />
    </>
  );
};
