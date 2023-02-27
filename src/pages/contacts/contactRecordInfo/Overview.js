import React from "react";
import Reminders from "./reminder";
import ClientNotes from "./clientNotes";
import Activities from "pages/ContactDetails/Activities";

export default ({
  personalInfo,
  reminders = [],
  getLeadDetails,
  id,
  isMobile,
}) => {
  return (
    <>
      <Reminders
        getLeadDetails={getLeadDetails}
        leadId={id}
        reminders={reminders}
        isMobile={isMobile}
      />
      <Activities getLeadDetails={getLeadDetails} leadId={id} />
      <ClientNotes
        personalInfo={personalInfo || {}}
        getLeadDetails={getLeadDetails}
      />
    </>
  );
};
