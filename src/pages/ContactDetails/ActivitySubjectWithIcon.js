import React from "react";
import Activity from "components/icons/activities/Activity";
import List from "components/icons/activities/List";
import CallRecording from "components/icons/activities/CallRecording";
import styles from "./ActivitySubjectWithIcon.module.scss";

export default function ActivitySubjectWithIcon({ activitySubject }) {
  const getIcon = () => {
    const icon = {
      "Call updated": <CallRecording />,
      "Stage Change": <List />,
    };

    return icon[activitySubject] || <Activity />;
  };

  return <div className={styles.icon}>{getIcon()}</div>;
}
