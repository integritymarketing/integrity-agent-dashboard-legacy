import React from "react";
import Activities from "./activity";
import Reminders from "./reminder";
import ClientNotes from "./clientNotes";

export default ({
  personalInfo,
  reminders,
  activities,
  getContactRecordInfo,
  id,
}) => {
  return (
    <>
      <Reminders
        getContactRecordInfo={getContactRecordInfo}
        leadId={id}
        reminders={reminders}
      />
      <Activities
        activities={activities}
        getContactRecordInfo={getContactRecordInfo}
        leadId={id}
      />
      <ClientNotes personalInfo={personalInfo} />
    </>
  );
};
