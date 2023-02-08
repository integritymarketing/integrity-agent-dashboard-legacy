import React from "react";
import Add from "components/icons/add";
import Back from "components/icons/back";

export default function ActivitySubjectWithIcon({ activitySubject }) {
  const getIcon = () => {
    const icon = {
      "Call updated": <Add />,
      "Stage Change": <Add />,
    };

    const iconToShow = icon[activitySubject] || <Back />;
    return iconToShow;
  };

  return getIcon(activitySubject);
}
