import React from "react";
import LINK from "components/icons/activities/Link";
import DOWNLOAD from "components/icons/activities/Download";
import styles from "./ActivitySubjectWithIcon.module.scss";
// import SOACOMPLETE from "components/icons/activities/SoaComplete";
import SoaView from "components/icons/activities/SoaView";
import VIEWPLANSCONTACT from "components/icons/activities/ViewPlansContact";
import View from "images/View.png";

export default function ActivityButtonIcon({ activitySubject, route = "" }) {
  const ImageToIcon = ({ src, alt }) => <img src={src} alt={alt} />;

  const getIcon = () => {
    const icon = {
      "Incoming Call": <LINK />,
      "Call Recording": <DOWNLOAD />,
      "Contact's new call log created": <DOWNLOAD />,
      "Outbound Call Recorded": <DOWNLOAD />,
      "Incoming Call Recorded": <DOWNLOAD />,
      "Scope of Appointment Signed": <SoaView />,
      "Scope of Appointment Completed": <SoaView />,
      "Plan Shared":
        route === "contactDetail" ? (
          <VIEWPLANSCONTACT />
        ) : (
          <ImageToIcon src={View} alt="Meeting Recorded" />
        ),
      "Application Submitted": (
        <ImageToIcon src={View} alt="Meeting Recorded" />
      ),
      "Meeting Recorded": <DOWNLOAD />,
    };

    return icon[activitySubject] || null;
  };

  return <div className={styles.linkIcon}>{getIcon()}</div>;
}
