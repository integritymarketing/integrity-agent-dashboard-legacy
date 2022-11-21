import React from "react";
import { Button } from "packages/Button";
import { useHistory } from "react-router-dom";
import ComparePlansService from "services/comparePlansService";
import useUserProfile from "hooks/useUserProfile";

const buttonTextByActivity = {
  "Incoming Call": "Link to Contact",
  "Call Recording": "Download",
  "Contact's new call log created": "Download",
  "Outbound Call Recorded": "Download",
  "Incoming Call Recorded": "Download",
  "Scope of Appointment Signed": "Complete",
  "Scope of Appointment Completed": "View",
  "Plan Shared": "View PLans",
  "Application Submitted": "View",
};

export default function ActivityButtonText(activity) {
  const { activityTypeName, activityInteractionURL, activitySubject, leadsId } =
    activity.activity;
  const history = useHistory();
  const userProfile = useUserProfile();
  const { npn } = userProfile;
  const splitViewPlansURL = activityInteractionURL.split("/");
  const handleClick = async (activitySubject, activityInteractionURL) => {
    switch (activitySubject) {
      case "Scope of Appointment Signed":
      case "Scope of Appointment Completed":
        history.push(
          `/contact/${leadsId}/soa-confirm/${activityInteractionURL}`
        );
        break;
      case "Plan Shared":
        history.push(
          `/plans/${leadsId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`
        );
        break;
      case "Incoming Call Recorded":
      case "Outbound Call Recorded":
      case "Call Recording":
      case "Contact's new call log created":
        window.open(activityInteractionURL, "_blank");
        break;
      case "Application Submitted":
        let link = await ComparePlansService?.getPdfSource(
          activityInteractionURL,
          npn
        );
        var url = await window.URL.createObjectURL(link);

        if (url && url !== "") {
          window.open(url, "_blank");
        } else {
          console.log("NO PDF SOURCE AVAILABLE", url);
        }
        break;
      default:
        break;
    }
  };

  const showButton =
    activityTypeName &&
    activityTypeName === "Triggered" &&
    activityInteractionURL
      ? true
      : false;

  const buttonText = buttonTextByActivity[activitySubject];

  return (
    <>
      {showButton && (
        <Button
          variant="primary"
          onClick={() =>
            handleClick(activitySubject, activityInteractionURL, leadsId)
          }
        >
          {buttonText}
        </Button>
      )}
    </>
  );
}
