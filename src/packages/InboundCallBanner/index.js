import React, { useState, useMemo } from "react";
import DashboardHeaderSection from "pages/dashbaord/DashboardHeaderSection";
import useCallRecordings from "hooks/useCallRecordings";
import { useHistory } from "react-router-dom";
import Heading4 from "packages/Heading4";
import { Typography } from "@mui/material";
import Tags from "packages/Tags/Tags";
import { CallScriptModal } from "packages/CallScriptModal";
import { formatPhoneNumber } from "utils/phones";
import IconWithText from "packages/IconWithText";
import Link from "images/link-svg.svg";
import CallScript from "components/icons/script";
import styles from "./styles.module.scss";
import { convertUTCDateToLocalDate, callDuration } from "utils/dates";

const IN_PROGRESS = "in-progress";

export default function InboundCallBanner() {
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const callRecordings = useCallRecordings();

  const callStatusInProgress = useMemo(
    () =>
      callRecordings.find(
        (callRecording) => callRecording.callStatus === IN_PROGRESS
      ),
    [callRecordings]
  );

  const navigateToLinkToContact = () => {
    const { callLogId, from, callStartTime, recordingStartTime, callEndTime } =
      callStatusInProgress;
    let duration = callDuration(recordingStartTime, callEndTime);
    const date = convertUTCDateToLocalDate(callStartTime);

    history.push(`/link-to-contact/${callLogId}/${from}/${duration}/${date}`);
  };

  const bannerContent = () => {
    const tags = callStatusInProgress?.callLogTags.map(
      (callLogTag) => callLogTag.tag.tagLabel
    );

    return (
      <>
        <div className={styles.inboundCallWrapper}>
          <Heading4 text="Incoming Call: " />
          <Typography color="#434A51" sx={{ mx: 1 }} variant={"subtitle1"}>
            {formatPhoneNumber(callStatusInProgress?.from, true)}{" "}
          </Typography>
        </div>
        <div
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <IconWithText text="Call Script" icon={<CallScript />} />
        </div>
        <div onClick={navigateToLinkToContact}>
          <IconWithText
            text="Link to Contact"
            icon={<img src={Link} alt="Link to Contact" />}
          />
        </div>
        {tags?.length > 0 && <Tags className="header-tag" words={tags} />}
      </>
    );
  };

  return (
    <>
      {callStatusInProgress && (
        <DashboardHeaderSection content={bannerContent()} />
      )}
      <CallScriptModal
        modalOpen={modalOpen}
        handleClose={() => {
          setModalOpen(false);
        }}
      />
    </>
  );
}
