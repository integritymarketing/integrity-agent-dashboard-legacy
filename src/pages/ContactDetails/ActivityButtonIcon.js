import React from "react";

import LINK from "components/icons/activities/Link";
import DOWNLOAD from "components/icons/activities/Download";
import styles from "./ActivitySubjectWithIcon.module.scss";
import SOACOMPLETE from "components/icons/activities/SoaComplete";
import SOAVIEW from "components/icons/activities/SoaView";
import VIEWPLANS from "components/icons/activities/ViewPlans";

export default function ActivityButtonIcon({ activitySubject }) {
  const getIcon = () => {
    const icon = {
      "Incoming Call": <LINK />,
      "Call Recording": <DOWNLOAD />,
      "Contact's new call log created": <DOWNLOAD />,
      "Outbound Call Recorded": <DOWNLOAD />,
      "Incoming Call Recorded": <DOWNLOAD />,
      "Scope of Appointment Signed": <SOACOMPLETE />,
      "Scope of Appointment Completed": <SOAVIEW />,
      "Plan Shared": <VIEWPLANS />,
      "Application Submitted": <VIEWPLANS />,
      "Meeting Recorded": <DOWNLOAD />,
    };

    return icon[activitySubject] || null;
  };

  return <div className={styles.linkIcon}>{getIcon()}</div>;
}
