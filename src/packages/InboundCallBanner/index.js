import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';

import DashboardHeaderSection from 'pages/dashbaord/DashboardHeaderSection';
import useCallRecordings from 'hooks/useCallRecordings';
import Heading4 from 'packages/Heading4';
import Tags from 'packages/Tags/Tags';
import { CallScriptModal } from 'packages/CallScriptModal';
import IconWithText from 'packages/IconWithText';

import { formatPhoneNumber } from 'utils/phones';
import { convertUTCDateToLocalDate, callDuration } from 'utils/dates';

import styles from './styles.module.scss';

import LinkIcon from 'images/link-svg.svg';
import CallScriptIcon from 'components/icons/script';

const IN_PROGRESS = 'in-progress';

export default function InboundCallBanner() {
  const history = useHistory();
  const [isModalOpen, setModalOpen] = useState(false);
  const callRecordings = useCallRecordings();

  const activeCallStatus = useMemo(
    () => callRecordings.find(record => record.callStatus === IN_PROGRESS),
    [callRecordings]
  );

  const navigateToLinkToContact = () => {
    const { callLogId, from, callStartTime, recordingStartTime, callEndTime } = activeCallStatus;
    const duration = callDuration(recordingStartTime, callEndTime);
    const localDate = convertUTCDateToLocalDate(callStartTime);

    history.push(`/link-to-contact/${callLogId}/${from}/${duration}/${localDate}`);
  };

  const renderBannerContent = () => {
    const tags = activeCallStatus?.callLogTags.map(tag => tag.tag.tagLabel);

    return (
      <>
        <div className={styles.inboundCallWrapper}>
          <Heading4 text="Incoming Call: " />
          <Typography color="#434A51" sx={{ mx: 1 }} variant="subtitle1">
            {formatPhoneNumber(activeCallStatus?.from, true)}
          </Typography>
        </div>
        <div onClick={() => setModalOpen(true)}>
          <IconWithText text="Call Script" icon={<CallScriptIcon />} />
        </div>
        <div onClick={navigateToLinkToContact}>
          <IconWithText text="Link to Contact" icon={<img src={LinkIcon} alt="Link to Contact" />} />
        </div>
        {tags?.length > 0 && <Tags className="header-tag" words={tags} />}
      </>
    );
  };

  return (
    <>
      {activeCallStatus && <DashboardHeaderSection content={renderBannerContent()} />}
      <CallScriptModal
        modalOpen={isModalOpen}
        handleClose={() => setModalOpen(false)}
      />
    </>
  );
}
