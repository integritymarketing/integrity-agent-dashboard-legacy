import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import Popover from '@mui/material/Popover';
import styles from './styles.module.scss';
import ActionModal from '../ActionModals';
import {
  ActionsCopy,
  ActionsRename,
  ActionsDelete,
  ActionsSend,
  ActionsPause,
  ActionsStart,
  ActionsEnd,
} from '@integritymarketing/icons';

const actionIconMap = {
  Copy: ActionsCopy,
  Rename: ActionsRename,
  Send: ActionsSend,
  Delete: ActionsDelete,
  Pause: ActionsPause,
  Start: ActionsStart,
  End: ActionsEnd,
  Resume: ActionsStart,
};

const campaignOperations = [
  {
    optionText: 'Pause',
    value: 'pause',
    optionLabel:
      'Are you sure you want to pause this campaign? You can resume this campaign later.',
  },
  {
    optionText: 'Resume',
    value: 'resume',
    optionLabel:
      'Are you sure you want to resume this campaign? Sent messages cannot be unsent. You can pause this campaign later.',
  },

  { optionText: 'Rename', value: 'rename', optionLabel: 'Edit campaign name.' },
  {
    optionText: 'Start',
    value: 'start',
    optionLabel:
      'Are you sure you want to start this campaign? Sent messages cannot be unsent. You can pause this campaign later.',
  },
  {
    optionText: 'Send',
    value: 'send',
    optionLabel:
      'Are you sure you want to send this campaign? Sent messages cannot be unsent.',
  },
  {
    optionText: 'Copy',
    value: 'copy',
    optionLabel: 'Give your campaign a new name and then select create.',
  },
  {
    optionText: 'Delete',
    value: 'delete',
    optionLabel:
      'Are you sure you want to delete this draft? This action cannot be undone.',
  },
  {
    optionText: 'End',
    value: 'end',
    optionLabel:
      'Are you sure you want to end this campaign? This action cannot be undone.',
  },
];

const ActionPopover = ({
  anchorEl,
  onClose,
  campaign,
  refresh,
  advanceMode,
  campaignDescription,
  buttonDisable,
  page,
}) => {
  const open = Boolean(anchorEl);
  const id = anchorEl ? 'simple-popover-actions' : undefined;
  const {
    campaignChannel,
    requestPayload,
    campaignSelectedAction,
    campaignStatus,
  } = campaign;

  const [campaignAction, setCampaignAction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleActionModalOpen = actionOptions => {
    setModalOpen(true);
    setCampaignAction(actionOptions);
  };
  const onCloseActionModal = () => {
    setModalOpen(false);
    setCampaignAction(null);
    onClose();
  };

  const isCampaignCanStarted = useMemo(() => {
    return page === 'campaign_details'
      ? !buttonDisable
      : campaignChannel &&
          campaignSelectedAction &&
          requestPayload?.templateId &&
          ((campaignSelectedAction === 'a contact when' &&
            campaign?.eventTrigger) ||
            (campaignSelectedAction !== 'a contact when' &&
              requestPayload?.leads?.length > 0));
  }, [
    page,
    buttonDisable,
    campaignChannel,
    campaignSelectedAction,
    requestPayload?.templateId,
    campaign?.eventTrigger,
    requestPayload?.leads?.length,
  ]);

  const showIcon = (optionText, disable) => {
    const Icon = actionIconMap[optionText];
    if (!Icon) return null;
    return (
      <Icon
        size='md'
        className={styles.actionIcon}
        color={disable ? '#00000061' : '#4178FF'}
      />
    );
  };

  // Function to get filtered campaign operations based on the campaign status
  const getFilteredCampaignOperations = () => {
    const baseFilter = item => {
      // Default filter for "copy" operation across all campaign statuses
      return item.value === 'copy';
    };

    switch (campaignStatus) {
      case 'Completed':
        return campaignOperations.filter(baseFilter);
      case 'Draft':
        return campaignOperations.filter(item =>
          advanceMode
            ? ['rename', 'start', 'copy', 'delete'].includes(item.value)
            : ['rename', 'send', 'copy', 'delete'].includes(item.value)
        );
      case 'Active':
        return campaignOperations.filter(item =>
          ['pause', 'copy', 'end'].includes(item.value)
        );
      case 'Paused':
        return campaignOperations.filter(item =>
          ['resume', 'copy', 'end'].includes(item.value)
        );
      default:
        return [];
    }
  };

  const filteredCampaignOperations = useMemo(getFilteredCampaignOperations, [
    campaignStatus,
    advanceMode,
  ]);

  return (
    <>
      <Popover
        className={styles.customPopover}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '.MuiPaper-root': { borderRadius: '8px' },
        }}
      >
        {filteredCampaignOperations?.map((campaignObj, index) => {
          const isDisable =
            (campaignObj.value === 'send' || campaignObj.value === 'start') &&
            !isCampaignCanStarted;
          return (
            <>
              <Box
                sx={{ display: 'flex', padding: '8px' }}
                className={`  ${isDisable ? styles.disabledRow : ''}`}
                key={index}
              >
                <Box className={styles.actionIcons}>
                  <IconButton
                    size='lg'
                    className={`${styles.roundedIcon} ${
                      isDisable ? styles.disable : ''
                    }`}
                  >
                    {showIcon(campaignObj.optionText, isDisable)}
                  </IconButton>
                </Box>
                <Box
                  className={styles.selections}
                  onClick={() => {
                    if (!isDisable) {
                      handleActionModalOpen(campaignObj);
                    }
                  }}
                >
                  {campaignObj.optionText}
                </Box>
              </Box>
              {campaignObj.value == 'copy' && (
                <Box className={styles.cardDivider} />
              )}
            </>
          );
        })}
      </Popover>
      {modalOpen && (
        <ActionModal
          open={modalOpen}
          onClose={onCloseActionModal}
          campaignAction={campaignAction}
          campaign={campaign}
          refresh={refresh}
          campaignDescription={campaignDescription}
        />
      )}
    </>
  );
};

ActionPopover.propTypes = {
  anchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  campaign: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  advanceMode: PropTypes.bool,
  campaignDescription: PropTypes.string,
  buttonDisable: PropTypes.bool,
  page: PropTypes.string,
};

export default ActionPopover;
