import { useState } from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import useFetch from 'hooks/useFetch';
import useToast from 'hooks/useToast';
import useUserProfile from 'hooks/useUserProfile';

import Textfield from 'components/ui/textfield';
import Modal from 'components/Modal';
import Spinner from 'components/ui/Spinner';

import {
  StyledButton,
  StyledButton2,
} from 'pages/FinalExpensesPage/Components/StyledComponents';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@awesome.me/kit-7ab3488df1/icons/classic/light';

import styles from './index.module.scss';

const AGENTS_API_VERSION = 'v1.0';

export const SingleSignOnModal = ({
  isOpen,
  onClose,
  carrierInfo,
  resourceUrl,
  onApply,
  fetchPlans,
  writingAgentNumber,
  setIsSingleSignOnInitialModalOpen,
  handleRefreshPageWithNewLead,
  isQuickQuotePage,
}) => {
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState(null);
  const [producerId, setProducerId] = useState('');
  const showToast = useToast();
  const { npn } = useUserProfile();
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

  const URL = `${
    import.meta.env.VITE_AGENTS_URL
  }/api/${AGENTS_API_VERSION}/AgentsSelfService/fexAttestation/${npn}`;

  const { Post: addSALifeRecord } = useFetch(URL);

  const shouldDisable = !producerId || isContinuing || error;

  const handleClose = () => {
    setIsContinuing(false);
    setProducerId('');
    onClose();
  };

  const onChange = e => {
    const inputValue = e.target.value;
    setProducerId(inputValue);
  };

  const validateInput = input => {
    const alphanumericRegex = /^[a-z0-9]+$/i;
    if (input.length < 1 || input.length > 13) {
      return 'Input must be between 1 and 13 characters long.';
    }
    if (!alphanumericRegex.test(input)) {
      return 'Input must contain only alphanumeric characters.';
    }
    return null;
  };

  const onBlur = () => {
    const validatedError = validateInput(producerId);
    if (validatedError) {
      setError(validatedError);
    } else {
      setError(null);
    }
  };

  const refreshOrFetchPlans = () => {
    if (isQuickQuotePage) {
      handleRefreshPageWithNewLead();
    } else {
      fetchPlans();
    }
  };

  const onContinueWithIdHandle = async () => {
    setIsContinuing(true);
    try {
      const payload = {
        agentNPN: npn,
        carrierName: carrierInfo?.name,
        displayCarrierName: carrierInfo?.name,
        carrierId: carrierInfo?.id,
        productNames: [],
        producerId,
        isSelfAttested: 'Yes',
        inActive: 0,
        naic: carrierInfo?.naic,
      };

      const response = await addSALifeRecord(payload, true);
      if (response.ok) {
        handleClose();
        setIsContinuing(false);
        await onApply(producerId, true, refreshOrFetchPlans);
      }
      if (response.status === 400) {
        setIsContinuing(false);
        setIsSingleSignOnInitialModalOpen(true);
        handleClose();
        showToast({
          type: 'error',
          message: 'An error occurred',
          time: 10000,
        });
      }
    } catch (e) {
      showToast({
        type: 'error',
        message: e.message || 'An error occurred',
        time: 10000,
      });
      setIsContinuing(false);
      handleClose();
      handleRefreshPageWithNewLead();
    }
  };

  const onContinueWithoutIdHandle = () => {
    refreshOrFetchPlans();

    setTimeout(() => {
      window.open(resourceUrl, '_blank'); // Open carrier website after a slight delay
    }, 1000);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        handleClose();
        refreshOrFetchPlans();
      }}
      title='Producer ID Not Recognized'
      size='wide'
      hideFooter
      contentStyle={{ borderRadius: '8px' }}
    >
      <Box className={styles.modalContent}>
        {isContinuing && <Spinner />}
        {!isContinuing && (
          <>
            <Box>
              The carrier was unable to validate your Producer ID. Please revise
              your Carrier Producer ID. If this number is correct, please visit
              your Carrier’s website to validate contract status.
            </Box>

            <Box className={styles.actions}>
              <Box className={styles.label}>
                Producers ID/ Agent Writing Number (AWN)
              </Box>
              <Box>{writingAgentNumber}</Box>
              <Box mt={1}>
                <Box className={styles.label}>
                  Producers ID/ Writing Number (AWN)
                </Box>
                <Textfield
                  value={producerId}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder='Enter your ID Number'
                />
                {error && <Box className={styles.errorMessage}>{error}</Box>}
              </Box>
              {isMobile ? (
                <Box mt={4}>
                  <Button
                    onClick={onContinueWithIdHandle}
                    disabled={shouldDisable}
                    variant='contained'
                    endIcon={
                      <FontAwesomeIcon icon={faCircleArrowRight} size='xl' />
                    }
                    fullWidth
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    Continue
                  </Button>
                  <Box display='flex' justifyContent='space-between' mt={1}>
                    <Button
                      onClick={() => {
                        handleClose();
                        fetchPlans();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={onContinueWithoutIdHandle}>
                      Carrier Website
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  mt={4}
                >
                  <Button
                    onClick={() => {
                      handleClose();
                      refreshOrFetchPlans();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={onContinueWithoutIdHandle}>
                    Carrier Website
                  </Button>
                  <Button
                    onClick={onContinueWithIdHandle}
                    disabled={shouldDisable}
                    variant='contained'
                    endIcon={<ButtonCircleArrow />}
                    size='large'
                  >
                    Continue
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

SingleSignOnModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  carrierInfo: PropTypes.object,
  resourceUrl: PropTypes.string,
  onApply: PropTypes.func,
  fetchPlans: PropTypes.func,
};

SingleSignOnModal.defaultProps = {
  isOpen: false,
};

export default SingleSignOnModal;
