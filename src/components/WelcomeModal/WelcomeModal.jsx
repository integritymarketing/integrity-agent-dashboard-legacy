import { useLocation } from 'react-router-dom';
import { faArrowUpRightFromSquare } from '@awesome.me/kit-7ab3488df1/icons/classic/light';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography, Button, Divider, Checkbox } from '@mui/material';
import { CustomModal } from 'components/MuiComponents';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useClientServiceContext } from 'services/clientServiceProvider';
import * as Sentry from '@sentry/react';
import useToast from 'hooks/useToast';

export const WelcomeModal = ({ user, open, leadPreference }) => {
  const { clientsService } = useClientServiceContext();
  const showToast = useToast();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messageCheckbox, setMessageCheckbox] = useState(false);

  useEffect(() => {
    const isDismissedForSession = sessionStorage.getItem(
      'isAgentMobilePopUpDismissed'
    );
    if (!isDismissedForSession && location.pathname === '/dashboard') {
      setIsOpen(open);
    } else {
      setIsOpen(false);
    }
  }, [open, location.pathname]);

  const handleClose = useCallback(async () => {
    if (messageCheckbox) {
      try {
        const payload = {
          agentId: user?.agentId,
          leadPreference: {
            ...leadPreference,
            isAgentMobilePopUpDismissed: true,
          },
        };
        await clientsService.updateAgentPreferences(payload);
        showToast({
          type: 'success',
          message: 'Preferences updated successfully.',
        });
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to Save the Preferences.',
          time: 10000,
        });
        Sentry.captureException(error);
      }
    }

    setIsOpen(false);
    sessionStorage.setItem('isAgentMobilePopUpDismissed', 'true');
  }, [leadPreference, messageCheckbox, user, clientsService, showToast]);

  const onViewGuideClick = useCallback(async () => {
    if (messageCheckbox) {
      try {
        const payload = {
          agentId: user?.agentId,
          leadPreference: {
            ...leadPreference,
            isAgentMobilePopUpDismissed: true,
          },
        };
        await clientsService.updateAgentPreferences(payload);
        showToast({
          type: 'success',
          message: 'Preferences updated successfully.',
        });
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to Save the Preferences.',
          time: 10000,
        });
        Sentry.captureException(error);
      }
    }

    setIsOpen(false);
    sessionStorage.setItem('isAgentMobilePopUpDismissed', 'true');

    window.open(
      'https://learningcenter.tawebhost.com/Integrity-Quick-Start-Guide.pdf',
      '_blank'
    );
  }, [leadPreference, messageCheckbox, user, clientsService, showToast]);

  if (!isOpen) {
    return null;
  }

  return (
    <CustomModal
      title={`Welcome, ${user?.firstName}!`}
      open={isOpen}
      handleClose={handleClose}
    >
      <Box borderRadius={2} bgcolor='#FFFFFF' p={3}>
        <Typography variant='h4' color='#052A63' fontWeight={500} gutterBottom>
          Quick Start Guide
        </Typography>
        <Typography mt={2}>
          Within just a few minutes, you can be ready to start running quotes
          and submitting eApps!
        </Typography>
        <Typography my={3}>
          Follow our Quick Start Guide to finish setting up your account.
        </Typography>
        <Button
          variant='contained'
          endIcon={
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} color='#FFF' />
          }
          onClick={onViewGuideClick}
          sx={{ fontWeight: 500 }}
        >
          View Guide
        </Button>
        <Divider sx={{ my: 3, bgcolor: '#CCCCCC' }} />
        <Box display='flex' alignItems='center'>
          <Checkbox
            checked={messageCheckbox}
            onChange={event => {
              setMessageCheckbox(event.target.checked);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{
              color: '#CCCCCC',
            }}
          />
          <Typography>Don't show this message again.</Typography>
        </Box>
      </Box>
    </CustomModal>
  );
};

WelcomeModal.propTypes = {
  user: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  leadPreference: PropTypes.object.isRequired,
};

export default WelcomeModal;
