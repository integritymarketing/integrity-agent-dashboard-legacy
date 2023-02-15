import React from "react";
import Reminders from "./reminder";
import ClientNotes from "./clientNotes";
import Activities from "pages/ContactDetails/Activities";

export default ({ personalInfo, reminders = [], getLeadDetails, id }) => {
  return (
    <>
      <Reminders
        getLeadDetails={getLeadDetails}
        leadId={id}
        reminders={reminders}
      />
      <Activities getLeadDetails={getLeadDetails} leadId={id} />
      <ClientNotes
        personalInfo={personalInfo || {}}
        getLeadDetails={getLeadDetails}
      />
    </>
  );
};
