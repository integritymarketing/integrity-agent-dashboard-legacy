import React from "react";
import { useHistory } from "react-router-dom";

import LINK from "components/icons/activities/Link";
import DOWNLOAD from "components/icons/activities/Download";
import styles from "./ActivitySubjectWithIcon.module.scss";
import SOACOMPLETE from "components/icons/activities/SoaComplete";
import SOAVIEW from "components/icons/activities/SoaView";
import VIEWPLANS from "components/icons/activities/ViewPlans";

export default function ActivityButtonIcon({
  activitySubject,
  activityInteractionURL,
  leadsId,
}) {
  const history = useHistory();

  const getIcon = () => {
    const icon = {
      "Incoming Call": <LINK />,
      "Call Recorded": <DOWNLOAD />,
      "Scope of Appointment Signed": <SOACOMPLETE />,
      "Scope of Appointment Completed": <SOAVIEW />,
      "Plan Shared": <VIEWPLANS />,
    };

    return icon[activitySubject] || null;
  };

  const handleClick = () => {
    switch (activitySubject) {
      case "Scope of Appointment Signed":
      case "Scope of Appointment Completed":
        history.push(
          `/contact/${leadsId}/soa-confirm/${activityInteractionURL}`
        );
        break;
      case "Plan Shared":
        // TODO : change it with plan interaction URL
        break;
      case "Call Recorded":
        // TODO : change it with download URL
        break;
      case "Incoming Call":
        // TODO : change it with Link to contact URL
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.linkIcon} onClick={handleClick}>
      {getIcon()}
    </div>
  );
}
