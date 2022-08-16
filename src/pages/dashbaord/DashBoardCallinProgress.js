import React from "react";
import DashboardHeaderSection from "./DashboardHeaderSection";
import useCallRecordings from "hooks/useCallRecordings";

export default function DashboardCallinProgress({ content }) {
  const IN_PROGRESS = "in progress";
  const callRecordings = useCallRecordings();
  const callStatusInProgress = callRecordings.some(
    (callRecording) => callRecording.callStatus === IN_PROGRESS
  );
  return (
    <>{callStatusInProgress && <DashboardHeaderSection content={content} />}</>
  );
}
