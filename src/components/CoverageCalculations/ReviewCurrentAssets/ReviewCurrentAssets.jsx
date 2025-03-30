import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import PropTypes from 'prop-types';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useCallback } from 'react';
import { formatCurrency } from 'utils/shared-utils/sharedUtility';

const ReviewCurrentAssets = ({
  handleChange,
  handleNext,
  totalAvailableSavings,
  contactId,
  handleBack,
}) => {
  const {
    updateFinancialNeedsAnalysis,
    isFinancialNeedsAnalysisUpdating,
    financialNeedsAnalysis,
  } = useCoverageCalculationsContext();

  const onContinue = useCallback(async () => {
    if (
      financialNeedsAnalysis?.totalAvailableSavings === totalAvailableSavings
    ) {
      handleNext();
      return;
    }

    const response = await updateFinancialNeedsAnalysis(contactId, {
      totalAvailableSavings,
    });

    if (response) {
      handleNext();
    }
  }, [
    totalAvailableSavings,
    updateFinancialNeedsAnalysis,
    contactId,
    financialNeedsAnalysis,
    handleNext,
  ]);

  const isContinueButtonDisabled =
    isFinancialNeedsAnalysisUpdating || !totalAvailableSavings;

  return (
    <CoverageCalculationsCard
      title='Review current assets'
      subTitle='Enter total household liquid savings, or funds readily available without taxes or penalties.'
      onContinue={onContinue}
      showBackButton
      onBack={handleBack}
      showSkipButton
      onSkip={handleNext}
      isContinueButtonDisabled={isContinueButtonDisabled}
    >
      <Box my={4}>
        <Typography fontWeight='600' mb={1}>
          Total Available Savings
        </Typography>
        <TextField
          id='outlined-basic'
          variant='outlined'
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
          name='totalAvailableSavings'
          value={formatCurrency(totalAvailableSavings)}
          onChange={({ target }) => handleChange(target.name, target.value)}
        />
      </Box>
    </CoverageCalculationsCard>
  );
};

ReviewCurrentAssets.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  totalAvailableSavings: PropTypes.number,
  contactId: PropTypes.number.isRequired,
  handleBack: PropTypes.func.isRequired,
};

export default ReviewCurrentAssets;
