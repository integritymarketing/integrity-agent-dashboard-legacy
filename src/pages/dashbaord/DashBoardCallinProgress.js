import React, { useState } from "react";
import DashboardHeaderSection from "./DashboardHeaderSection";
import useCallRecordings from "hooks/useCallRecordings";
import { useHistory } from "react-router-dom";
import Heading4 from "packages/Heading4";
import { Typography } from "@mui/material";
import Tags from "packages/Tags/Tags";
import { CallScriptModal } from "packages/CallScriptModal";
import { formatPhoneNumber } from "utils/phones";
import IconWithText from "packages/IconWithText";
import LinkToContact from "components/icons/LinkToContact";
import CallScript from "components/icons/script";
import "./index.scss";

const IN_PROGRESS = "in-progress";

export default function DashboardCallinProgress({ agentInformation }) {
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const callRecordings = useCallRecordings();
  const callStatusInProgress = callRecordings.find(
    (callRecording) => callRecording.callStatus === IN_PROGRESS
  );

  const navigateToLinkToContact = () => {
    history.push(`/link-to-contact`);
  };

  const bannerContent = () => {
    const tags = callStatusInProgress?.callLogTags.map(
      (callLogTag) => callLogTag.tag.tagLabel
    );
    return (
      <>
        <div className="incomming-cal-wrapper">
          <Heading4 text="Incoming Call: " />
          <Typography sx={{ mx: 1 }} variant={"subtitle1"}>
            {formatPhoneNumber(agentInformation?.agentVirtualPhoneNumber, true)}{" "}
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
          <IconWithText text="Link to contact" icon={<LinkToContact />} />
        </div>
        {tags?.length && <Tags className="header-tag" words={tags} />}
      </>
    );
  };

  
  return (
    <>{callStatusInProgress && <DashboardHeaderSection content={bannerContent()} />}
    <CallScriptModal
        modalOpen={modalOpen}
        handleClose={() => {
          setModalOpen(false);
        }}
      /></>
  );
}
