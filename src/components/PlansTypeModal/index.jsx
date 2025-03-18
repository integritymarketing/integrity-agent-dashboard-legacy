import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

import useAgentInformationByID from 'hooks/useAgentInformationByID';
import useAnalytics from 'hooks/useAnalytics';
import useFetch from 'hooks/useFetch';
import useToast from 'hooks/useToast';
import useUserProfile from 'hooks/useUserProfile';

import { useAgentAccountContext } from 'providers/AgentAccountProvider';

import { SellingPermissionsModal } from 'components/FinalExpensePlansContainer/FinalExpenseContactDetailsForm/SellingPermissionsModal';
import { AGENT_SERVICE_NON_RTS } from 'components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants';
import Modal from 'components/Modal';
import HealthIcon from 'components/icons/healthIcon';
import LifeIcon from 'components/icons/lifeIcon';

import QuoteModalCard from 'components/CreateNewQuoteContainer/Common/QuoteModalCard';

import LifeQuestionCard from 'components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard';

import styles from './styles.module.scss';
import WithLoader from 'components/ui/WithLoader';
import {
  LIFE_QUESTION_CARD_LIST,
  LIFE_CARRIER_BASED_LIST,
} from 'components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants';
import IulGoalQuestionCard from 'components/CreateNewQuoteContainer/QuickQuoteModals/IulGoalQuestionCard';

const LIFE = 'hideLifeQuote';
const HEALTH = 'hideHealthQuote';
const IUL_FEATURE_FLAG = import.meta.env.VITE_IUL_FEATURE_FLAG === 'show';

const PlansTypeModal = ({
  showPlanTypeModal,
  isMultipleCounties,
  handleModalClose,
  leadId,
  zipcode,
  county,
}) => {
  const [checked, setChecked] = useState(false);
  const [showSellingPermissionModal, setShowSellingPermissionModal] =
    useState(false);
  const [showLifeQuestionCard, setShowLifeQuestionCard] = useState(false);
  const [showIulGoalQuestionCard, setShowIulGoalQuestionCard] = useState(false);
  const [isAgentNonRTS, setIsAgentNonRTS] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const showToast = useToast();
  const { agentId } = useUserProfile();
  const { agentInformation } = useAgentInformationByID();
  const agentNPN = agentInformation?.agentNPN;
  const { fireEvent } = useAnalytics();
  const { leadPreference, updateAgentPreferences } = useAgentAccountContext();

  const shouldShowPlanTypeModal =
    !leadPreference?.hideHealthQuote && !leadPreference?.hideLifeQuote;

  const { Get: getAgentNonRTS } = useFetch(
    `${AGENT_SERVICE_NON_RTS}${agentNPN}`
  );

  const onSelectHandle = useCallback(
    async type => {
      try {
        if (checked) {
          setChecked(false);
          const updatedType = type === LIFE ? HEALTH : LIFE;
          const payload = {
            agentID: agentId,
            leadPreference: {
              ...leadPreference,
              [updatedType]: true,
            },
          };
          await updateAgentPreferences(payload);
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to save the preferences.',
          time: 10000,
        });
      }
    },
    [agentId, checked, leadPreference, showToast, updateAgentPreferences]
  );

  const handleSellingPermissionModalContinue = () => {
    onSelectHandle(LIFE);
    setShowSellingPermissionModal(false);
    handleContinue();
  };

  const handleHealthPlanClick = useCallback(() => {
    onSelectHandle(HEALTH);
    if (zipcode && !isMultipleCounties && county) {
      fireEvent('Quote Type Selected', {
        leadid: leadId,
        line_of_business: 'Health',
      });
      navigate(`/plans/${leadId}`);
    } else {
      navigate(`/contact/${leadId}/addZip`);
    }
    setIsLoading(false);
  }, [
    county,
    fireEvent,
    isMultipleCounties,
    leadId,
    navigate,
    onSelectHandle,
    zipcode,
  ]);

  const handleFinalExpensePlanClick = useCallback(async () => {
    setIsLoading(true);
    let isAgentNonRTSResponse = null;
    if (isAgentNonRTS) {
      isAgentNonRTSResponse = isAgentNonRTS;
    } else {
      isAgentNonRTSResponse = await getAgentNonRTS();
      setIsAgentNonRTS(isAgentNonRTSResponse);
    }
    if (isAgentNonRTSResponse === 'True') {
      setShowSellingPermissionModal(true);
    } else {
      await onSelectHandle(LIFE);
      fireEvent('Quote Type Selected', {
        leadid: leadId,
        line_of_business: 'Life',
      });
      if (IUL_FEATURE_FLAG) {
        setShowLifeQuestionCard(true);
      } else {
        navigate(`/finalexpenses/create/${leadId}`);
      }
    }
    setIsLoading(false);
  }, [fireEvent, getAgentNonRTS, leadId, navigate, onSelectHandle]);

  const handleContinue = () => {
    fireEvent('Quote Type Selected', {
      leadid: leadId,
      line_of_business: 'Life',
    });
    if (IUL_FEATURE_FLAG) {
      setShowLifeQuestionCard(true);
    } else {
      handleModalClose();
      navigate(`/finalexpenses/create/${leadId}`);
    }
  };

  const handleSelectLifeProductType = useCallback(
    item => {
      switch (item) {
        case LIFE_QUESTION_CARD_LIST.FINAL_EXPENSE:
          navigate(`/finalexpenses/create/${leadId}`);
          break;
        case LIFE_QUESTION_CARD_LIST.SIMPLIFIED_IUL:
          navigate(`/simplified-iul/create/${leadId}`);
          break;
        case LIFE_QUESTION_CARD_LIST.INDEXED_UNIVERSAL_LIFE:
        case LIFE_CARRIER_BASED_LIST.FULLY_IUL:
          setShowLifeQuestionCard(false);
          setShowIulGoalQuestionCard(true);
          break;
        case LIFE_QUESTION_CARD_LIST.TERM:
        case LIFE_CARRIER_BASED_LIST.TERM_LIFE:
          navigate(`/life/term/${leadId}/confirm-details`);
          break;
        case LIFE_CARRIER_BASED_LIST.GUARANTEED_UL:
          navigate(`/life/guaranteed-ul/${leadId}/confirm-details`);
          break;
        default:
          break;
      }
    },
    [leadId, navigate]
  );

  const handleSelectIulGoal = useCallback(
    item => {
      if (item == 'Accumulation') {
        navigate(`/life/iul-accumulation/${leadId}/confirm-details`);
      } else {
        navigate(`/life/iul-protection/${leadId}/confirm-details`);
      }
    },
    [leadId, navigate]
  );

  /**
   * If the modal is shown and both health and life quotes are not hidden,
   * it determines the current type from the user's preferences.
   * If the current type is health, it triggers the health plan click.
   * If the current type is life, it triggers the final expense plan click.
   */
  useEffect(() => {
    if (!shouldShowPlanTypeModal && showPlanTypeModal) {
      const currentType = leadPreference?.hideLifeQuote ? HEALTH : LIFE;
      if (currentType === HEALTH) {
        handleHealthPlanClick();
      } else {
        handleFinalExpensePlanClick();
      }
    }
  }, [
    shouldShowPlanTypeModal,
    leadPreference,
    showPlanTypeModal,
    handleHealthPlanClick,
    handleFinalExpensePlanClick,
  ]);

  return (
    <>
      <Modal
        open={showPlanTypeModal}
        onClose={handleModalClose}
        hideFooter
        title='Select a Product Category'
      >
        <WithLoader isLoading={isLoading}>
          {!showLifeQuestionCard && !showIulGoalQuestionCard && (
            <>
              <Box className={styles.container}>
                <Box
                  className={styles.plan}
                  onClick={handleFinalExpensePlanClick}
                >
                  <Box className={styles.icon}>
                    <LifeIcon />
                  </Box>
                  <Box className={styles.title}>LifeCENTER</Box>
                </Box>
                <Box className={styles.plan} onClick={handleHealthPlanClick}>
                  <Box className={styles.icon}>
                    <HealthIcon />
                  </Box>
                  <Box className={styles.title}>MedicareCENTER</Box>
                </Box>
              </Box>
              <Divider />
              <Box
                display='flex'
                gap='0px'
                alignItems='center'
                justifyContent='center'
                marginTop='30px'
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                  }
                  label="Don't show this again"
                />
              </Box>
            </>
          )}
          {showLifeQuestionCard && !showIulGoalQuestionCard && (
            <QuoteModalCard
              action={
                shouldShowPlanTypeModal
                  ? () => setShowLifeQuestionCard(false)
                  : null
              }
            >
              <LifeQuestionCard
                IUL_FEATURE_FLAG={IUL_FEATURE_FLAG}
                handleSelectLifeProductType={handleSelectLifeProductType}
              />
            </QuoteModalCard>
          )}
          {!showLifeQuestionCard && showIulGoalQuestionCard && (
            <QuoteModalCard
              action={() => {
                setShowLifeQuestionCard(true);
                setShowIulGoalQuestionCard(false);
              }}
            >
              <IulGoalQuestionCard handleSelectIulGoal={handleSelectIulGoal} />
            </QuoteModalCard>
          )}
        </WithLoader>
      </Modal>
      <SellingPermissionsModal
        showSellingPermissionModal={showSellingPermissionModal}
        handleModalClose={() => {
          setShowSellingPermissionModal(false);
          handleModalClose();
        }}
        handleContinue={handleSellingPermissionModalContinue}
      />
    </>
  );
};

PlansTypeModal.propTypes = {
  showPlanTypeModal: PropTypes.bool.isRequired, // Determines if the modal is open
  handleModalClose: PropTypes.func.isRequired, // Function to call when closing the modal
  leadId: PropTypes.number.isRequired, // Lead ID for navigation
  zipcode: PropTypes.string.isRequired, // zip code value
  isMultipleCounties: PropTypes.bool.isRequired, // Determines if there are multiple counties
  county: PropTypes.string, // County value
};

export default PlansTypeModal;
