import { Box } from '@mui/material';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import PropTypes from 'prop-types';
import { Slider } from '@integritymarketing/clients-ui-kit';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useCallback } from 'react';

const RemainingMortgageAmount = ({
  handleBack,
  handleNext,
  remainingMortgageAmount,
  handleChange,
  contactId,
}) => {
  const {
    updateFinancialNeedsAnalysis,
    isFinancialNeedsAnalysisUpdating,
    financialNeedsAnalysis,
  } = useCoverageCalculationsContext();

  const onContinue = useCallback(async () => {
    if (
      financialNeedsAnalysis?.remainingMortgageAmount ===
      remainingMortgageAmount
    ) {
      handleNext();
      return;
    }

    const response = await updateFinancialNeedsAnalysis(contactId, {
      remainingMortgageAmount,
    });

    if (response) {
      handleNext();
    }
  }, [remainingMortgageAmount, updateFinancialNeedsAnalysis, contactId]);

  const validRemainingMortgageAmount =
    remainingMortgageAmount != null &&
    remainingMortgageAmount >= 0 &&
    remainingMortgageAmount <= 1000000
      ? remainingMortgageAmount
      : 200000;

  return (
    <CoverageCalculationsCard
      title='And remaining mortgage?'
      subTitle='Use the slider to confirm amount remaining on mortgage.'
      onContinue={onContinue}
      onSkip={handleNext}
      showBackButton
      onBack={handleBack}
      isContinueButtonDisabled={isFinancialNeedsAnalysisUpdating || remainingMortgageAmount == 0}
    >
      <Box my={4}>
        <Slider
          value={parseInt(validRemainingMortgageAmount)}
          max={1000000}
          min={0}
          handleChange={(_, value) =>
            handleChange('remainingMortgageAmount', value)
          }
          type='money'
        />
      </Box>
    </CoverageCalculationsCard>
  );
};

RemainingMortgageAmount.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  remainingMortgageAmount: PropTypes.number.isRequired,
};

export default RemainingMortgageAmount;
