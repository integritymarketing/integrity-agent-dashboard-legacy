import React from "react";
import Activity from "components/icons/activities/Activity";
import List from "components/icons/activities/List";
import CallRecording from "components/icons/activities/CallRecording";
import ContactUpdated from "components/icons/activities/Contacts";
import styles from "./ActivitySubjectWithIcon.module.scss";
import Reminder from "components/icons/activities/Reminder";
import SOA from "components/icons/activities/SOA";
import ApplicationSubmitted from "components/icons/ApplicationSubmitted";
import share from "../../images/Plans-Shared.png";
import MeetingRecorded from "components/icons/activities/MeetingRecorded";

export default function ActivitySubjectWithIcon({ activitySubject }) {
  const Share = () => (
    <img className="plans-shared" src={share} alt="Plans shared" />
  );
  const getIcon = () => {
    const icon = {
      "Contact Updated": <ContactUpdated />,
      "Contact Created": <ContactUpdated />,
      "Contact Imported": <ContactUpdated />,
      "Stage Change": <List />,
      "Incoming Call": <CallRecording />,
      "Call Recording": <CallRecording />,
      "Outbound Call Recorded": <CallRecording />,
      "Incoming Call Recorded": <CallRecording />,
      "Reminder Added": <Reminder />,
      "Reminder Complete": <Reminder />,
      "Scope of Appointment Sent": <SOA />,
      "Scope of Appointment Signed": <SOA />,
      "Scope of Appointment Completed": <SOA />,
      "Plan Shared": <Share />,
      "Contact's new call log created": <CallRecording />,
      "Application Submitted": <ApplicationSubmitted />,
      "Meeting Recorded": <MeetingRecorded />,
    };

    return icon[activitySubject] || <Activity />;
  };

  return <div className={styles.icon}>{getIcon()}</div>;
}
