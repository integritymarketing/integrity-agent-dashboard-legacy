import React, { useState } from "react";
import AddNote from "components/icons/add-note";
import ActivityModal from "./ActivityModal";
import SuccessIcon from "components/icons/success-note";
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
                          <SuccessIcon />
                        </span>
                        <label>
                          {item.modifyDate
                            ? getForDistance(item.modifyDate)
                            : getForDistance(item.createDate)}
                        </label>
                      </p>
                      <div className="mobile-edit">
                        <button onClick={() => editActivity(item)}>Edit</button>
                      </div>
                    </div>
                    <h6>{item.activitySubject}</h6>
                    <div className="para-btn-section">
                      <p>
                        <LimitedCharacters
                          characters={item.activityBody}
                          size={150}
                        />
                      </p>

                      {hovered && hovered === item.activityId && (
                        <div className="hover-btn-hide datepicker-row reminderCardSection2row1of1">
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
              Show 5 More
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
        setActivityModalStatus={() => setActivityModalStatus(false)}
        leadId={leadId}
        getContactRecordInfo={getContactRecordInfo}
      />
    </>
  );
};
