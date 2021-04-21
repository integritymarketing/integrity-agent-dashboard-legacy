import React, { useState } from "react";
import AddNote from "components/icons/add-note";
import ActivityModal from "./ActivityModal";
import Activity from "./Activity";
export default () => {
  const [activityModalStatus, setActivityModalStatus] = useState(false);
  return (
    <>
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
      {[1, 2, 3].map((item, index) => {
        return(
          <Activity key={index} />
        )
      })
    }
      </div>
      <div className="activityCardfooter">
        <p>Show 5 More</p>
      </div>
    </div>
       <ActivityModal
        activityModalStatus={activityModalStatus}
        setActivityModalStatus={() => setActivityModalStatus(false)}
      />
    </>
  );
};
