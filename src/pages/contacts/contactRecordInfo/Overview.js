import React from "react";
import Reminders from "./reminder";
import ClientNotes from "./clientNotes";
import Activities from "pages/ContactDetails/Activities";

const Overview = ({
  personalInfo,
  reminders = [],
  getLeadDetails,
  id,
  isMobile,
  setDisplay,
}) => {
  return (
    <>
      <Reminders
        getLeadDetails={getLeadDetails}
        leadId={id}
        reminders={reminders}
        isMobile={isMobile}
      />
      <Activities
        getLeadDetails={getLeadDetails}
        personalInfo={personalInfo}
        leadId={id}
        setDisplay={setDisplay}
      />
      <ClientNotes
        personalInfo={personalInfo || {}}
        getLeadDetails={getLeadDetails}
      />
    </>
  );
};

export default Overview;
