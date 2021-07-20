import React from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";
import Editicon from "components/icons/edit-details";

export default (props) => {
  return (
    <div className="contactdetailscard">
      <div className="scope-details-card-header contactdetailscardheader">
        <h4>Contact Details</h4>
        {!props.isEdit && (
          <button className="send-btn" onClick={() => props.setEdit(true)}>
            <Editicon />
            <span className="edit-btn-text">Edit</span>
          </button>
        )}
      </div>
      <div className="contactdetailscardbody">
        {props.isEdit ? <EditForm {...props} /> : <ContactDetails {...props} />}
      </div>
    </div>
  );
};
