import React from "react";
import Activity from "components/icons/activities/Activity";
import List from "components/icons/activities/List";
import CallRecording from "components/icons/activities/CallRecording";

import ContactUpdated from "components/icons/activities/Contacts";

import styles from "./ActivitySubjectWithIcon.module.scss";
import Reminder from "components/icons/activities/Reminder";
import SOA from "components/icons/activities/SOA";
import Share from "components/icons/share";

export default function ActivitySubjectWithIcon({ activitySubject }) {
  const getIcon = () => {
    const icon = {
      "Contact Updated": <ContactUpdated />,
      "Contact Created": <ContactUpdated />,
      "Stage Change": <List />,
      "Incoming Call": <CallRecording />,
      "Call Recorded": <CallRecording />,
      "Reminder Added": <Reminder />,
      "Scope of Appointment Sent": <SOA />,
      "Scope of Appointment Signed": <SOA />,
      "Scope of Appointment Completed": <SOA />,
      "Plan Shared": <Share />,
    };

    return icon[activitySubject] || <Activity />;
  };

  return <div className={styles.icon}>{getIcon()}</div>;
}
