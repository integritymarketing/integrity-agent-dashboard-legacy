import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AddNote from "components/icons/add-note";
import ActivityModal from "./ActivityModal";
import SuccessIcon from "components/icons/success-note";
import BellIcon from "components/icons/bell-note";
import { getForDistance } from "utils/dates";
import LimitedCharacters from "./limitedCharacters";
import clientsService from "services/clientsService";
import useToast from "../../../../hooks/useToast";

export default ({ activities, leadId, getContactRecordInfo }) => {
  const [activityModalStatus, setActivityModalStatus] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activityData, setActivityData] = useState({});
  const [hovered, setHovered] = useState(null);
  const addToast = useToast();
  const [showSize, setShowSize] = useState(3);
  const history = useHistory();

  const deleteActivity = async (activityId) => {
    await clientsService.deleteActivity(activityId);
    getContactRecordInfo();
    addToast({
      type: "success",
      message: "Activity successfully deleted",
      time: 3000,
    });
  };
  const editActivity = (data) => {
    setActivityData({ ...data });
    setIsEdit(true);
    setActivityModalStatus(true);
  };

  const closeModal = () => {
    setActivityData({});
    setIsEdit(false);
    setActivityModalStatus(false);
  };

  const navigateToSOA = (item) => {
    history.push(
      `/contact/${leadId}/soa-confirm/${item?.activityInteractionURL}`
    );
  };

  return (
    <>
      <div className="activityCard" data-gtm="contact-record-activity-section">
        <div className="activityCardHeader">
          <h4>Activity</h4>
          <p
            className="notetext"
            data-gtm="contact-record-new-note-button"
            onClick={() => setActivityModalStatus(true)}
          >
            <span>
              <AddNote />
            </span>
            <label>Add New</label>
          </p>
        </div>
        <hr className="headerlineseparation" />
        <div className="activityCardbody">
          {activities.length > 0 &&
            activities.map((item, index) => {
              if (index < showSize) {
                return (
                  <div
                    key={index}
                    className="activityCardbodyset"
                    data-gtm="contact-record-activity-item"
                    onMouseEnter={() => setHovered(item.activityId)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="mobile-edit-section">
                      <p className="iconTime">
                        <span className="bg-color bg-color2">
                          {item.activityTypeName === "Triggered" && (
                            <BellIcon />
                          )}
                          {item.activityTypeName === "Note" && <SuccessIcon />}
                        </span>
                        <label>
                          {item.modifyDate
                            ? getForDistance(item.modifyDate)
                            : getForDistance(item.createDate)}
                        </label>
                      </p>
                      {hovered &&
                        hovered === item.activityId &&
                        item.activityTypeName === "Note" && (
                          <div className="hover-btn-hide datepicker-row reminderCardSection2row1of1 activity-Btn">
                            <button
                              className="deleteTextAreaText"
                              onClick={() => deleteActivity(item.activityId)}
                            >
                              Delete
                            </button>
                            <button
                              className="ediTextAreaText"
                              onClick={() => editActivity(item)}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      <div className="mobile-edit">
                        <button onClick={() => editActivity(item)}>Edit</button>
                      </div>
                    </div>
                    <h6>{item.activitySubject}</h6>
                    <div className="para-btn-section flex-dir-column">
                      <LimitedCharacters
                        characters={item.activityBody}
                        size={150}
                      />

                      {item.activityTypeName === "Triggered" && item?.activityInteractionURL &&
                        (item.activitySubject ===
                          "Scope of Appointment Signed" ||
                          item.activitySubject ===
                            "Scope of Appointment Completed") && (
                          <div className="remindercardsectioncancelsavebtn reminderCardSection2row2right full-width-mobile ">
                            <button
                              className={`${
                                item.activitySubject ===
                                "Scope of Appointment Signed"
                                  ? "complete-btn"
                                  : "activity-complete-btn"
                              } full-width-mobile mt-10-mb`}
                              data-gtm="contact-record-activity-view-soa-button"
                              onClick={() => navigateToSOA(item)}
                            >
                              {item.activitySubject ===
                              "Scope of Appointment Signed"
                                ? "Complete"
                                : "View"}
                            </button>
                          </div>
                        )}
                    </div>

                    <hr className="bodylineseparation" />
                  </div>
                );
              } else return null;
            })}
        </div>
        <div
          className="activityCardfooter"
          data-gtm="contact-record-activity-show-5-more"
        >
          {showSize < activities.length ? (
            <p
              className="showmorebtn"
              onClick={() => setShowSize(showSize + 5)}
            >
              Show More
            </p>
          ) : (
            <p></p>
          )}
        </div>
      </div>
      <ActivityModal
        isEdit={isEdit}
        deleteActivity={deleteActivity}
        activityData={activityData}
        activityModalStatus={activityModalStatus}
        setModalClose={closeModal}
        leadId={leadId}
        getContactRecordInfo={getContactRecordInfo}
      />
    </>
  );
};
