import { useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import PropTypes from 'prop-types';
import { Divider, Box } from '@mui/material';
import useFetch from 'hooks/useFetch';
import useUserProfile from 'hooks/useUserProfile';
import { SellingPermissionsModal } from 'components/FinalExpensePlansContainer/FinalExpenseContactDetailsForm/SellingPermissionsModal';
import { AGENT_SERVICE_NON_RTS } from 'components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants';
import Checkbox from 'components/ui/Checkbox';
import { LifeHealthProducts } from '../Common';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

const SelectProductCard = ({ setQuoteModalStage }) => {
  const [showSellingPermissionModal, setShowSellingPermissionModal] =
    useState(false);
  const { handleSelectedProductType, setDoNotShowAgain, doNotShowAgain } =
    useCreateNewQuote();
  const { npn } = useUserProfile();
  const { Get: getAgentNonRTS } = useFetch(`${AGENT_SERVICE_NON_RTS}${npn}`);

  const handleHealthPlanClick = () => {
    setQuoteModalStage('zipCodeInputCard');
  };

  const handleLifePlanClick = useCallback(async () => {
    try {
      const isAgentNonRTS = await getAgentNonRTS();
      if (isAgentNonRTS === 'True') {
        setShowSellingPermissionModal(true);
      } else {
        handleSelectedProductType('life');
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [getAgentNonRTS, handleSelectedProductType]);

  const handleContinue = () => {
    handleSelectedProductType('life');
  };

  return (
    <>
      <LifeHealthProducts
        handleLifePlanClick={handleLifePlanClick}
        handleHealthPlanClick={handleHealthPlanClick}
      />
      <Divider />
      <Box
        display='flex'
        gap='0px'
        alignItems='center'
        justifyContent='center'
        marginTop='30px'
      >
        <Checkbox
          label="Don't show this again"
          checked={doNotShowAgain}
          onChange={() => setDoNotShowAgain(!doNotShowAgain)}
        />
      </Box>

      <SellingPermissionsModal
        showSellingPermissionModal={showSellingPermissionModal}
        handleModalClose={() => setShowSellingPermissionModal(false)}
        handleContinue={handleContinue}
      />
    </>
  );
};

SelectProductCard.propTypes = {
  isMultipleCounties: PropTypes.bool.isRequired,
  setQuoteModalStage: PropTypes.func.isRequired,
};

export default SelectProductCard;
