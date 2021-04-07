import React, { useState } from "react";

import AddNote from "components/icons/add-note";
import EditNote from "components/icons/edit-note";
import DeleteNote from "components/icons/delete";
import BellIcon from "components/icons/bell-note";
import SuccessIcon from "components/icons/success-note";
import WarningIcon from "components/icons/warning-note";
import ActivityModal from "./ActivityModal";

import "./activity.scss";

export default () => {
  const [modalStatus, setModalStatus] = useState(false);

  return (
    <div className="activityCard">
      <div className="activityCardHeader">
        <h4>Activity</h4>
        <p className="notetext" onClick={() => setModalStatus(true)}>
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
              <a href="/#">View More</a>
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
              <a href="/#">
                <DeleteNote />
              </a>
              <a href="/#">
                <EditNote />
              </a>
            </div>
          </div>
          <h6>SOA Signed</h6>
          <div className="para-btn-section">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
              <a href="/#">View More</a>
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
              <a href="/#">View More</a>
            </p>
            <button className="view-btn">View SOA</button>
          </div>
          <hr className="bodylineseparation" />
        </div>
      </div>
      <div className="activityCardfooter">
        <p>Show 5 More</p>
      </div>
      <ActivityModal
        modalStatus={modalStatus}
        setModalStatus={() => setModalStatus(false)}
      />
    </div>
  );
};
