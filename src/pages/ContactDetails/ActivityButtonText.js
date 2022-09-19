import React from "react";
import { Button } from "packages/Button";
import { useHistory, useParams } from "react-router-dom";

const buttonTextByActivity = {
  "Incoming Call": "Link to Contact",
  "Call Recording": "Download",
  "Contact's new call log created": "Download",
  "Outbound Call Recorded": "Download",
  "Incoming Call Recorded": "Download",
  "Scope of Appointment Signed": "Complete",
  "Scope of Appointment Completed": "View",
  "Plan Shared": "View PLans",
};

export default function ActivityButtonText(activity) {
  const {
    activityTypeName,
    activityInteractionURL,
    activitySubject,
  } = activity.activity;
  const history = useHistory();
  const { contactId: leadsId } = useParams();

  const handleClick = (activitySubject, activityInteractionURL, leadsId) => {
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
      case "Incoming Call Recorded":
      case "Outbound Call Recorded":
      case "Call Recording":
        window.open(activityInteractionURL, "_blank");
        break;
      case "Contact's new call log created":
        window.open(activityInteractionURL, "_blank");
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
