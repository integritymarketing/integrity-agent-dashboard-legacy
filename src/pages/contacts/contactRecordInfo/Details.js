import React from "react";
import EditForm from "./DetailsEdit";
import ContactDetails from "./ContactDetails";

export default (props) => {
  return (
    <div className="contactdetailscard">
      {props.isEdit ? <EditForm {...props} /> : <ContactDetails {...props} />}
    </div>
  );
};
