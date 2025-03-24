import PropTypes from 'prop-types';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { Slider } from '@integritymarketing/clients-ui-kit';
import { formatCurrency } from 'utils/shared-utils/sharedUtility';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useCallback } from 'react';

const TotalIncome = ({
  handleNext,
  handleBack,
  handleChange,
  totalAnnualIncome,
  yearsIncomeReplacement,
  contactId,
}) => {
  const {
    updateFinancialNeedsAnalysis,
    isFinancialNeedsAnalysisUpdating,
    financialNeedsAnalysis,
  } = useCoverageCalculationsContext();

  const onContinue = useCallback(async () => {
    if (
      financialNeedsAnalysis?.totalAnnualIncome === totalAnnualIncome &&
      financialNeedsAnalysis?.yearsIncomeReplacement === yearsIncomeReplacement
    ) {
      handleNext();
      return;
    }

    const response = await updateFinancialNeedsAnalysis(contactId, {
      totalAnnualIncome,
      yearsIncomeReplacement,
    });

    if (response) {
      handleNext();
    }
  }, [
    totalAnnualIncome,
    updateFinancialNeedsAnalysis,
    yearsIncomeReplacement,
    contactId,
    handleNext,
    financialNeedsAnalysis,
  ]);

  // Use API response if available, else default to 10
  const validYearsIncomeReplacement =
    yearsIncomeReplacement != null &&
    yearsIncomeReplacement >= 1 &&
    yearsIncomeReplacement <= 30
      ? yearsIncomeReplacement
      : 10;

  const isContinueButtonDisabled =
    isFinancialNeedsAnalysisUpdating || !totalAnnualIncome;

  return (
    <CoverageCalculationsCard
      title={
        <Typography variant='h3' color='#052A63'>
          Now let's go over income.
        </Typography>
      }
      subTitle='Please enter their annual income sources may receive from any source.'
      onContinue={onContinue}
      onSkip={handleNext}
      showBackButton
      onBack={handleBack}
      isContinueButtonDisabled={isContinueButtonDisabled}
    >
      <Box my={4}>
        <Typography fontWeight='600' mb={1} sx={{ color: '#052A63' }}>
          Total Income
        </Typography>
        <TextField
          id='outlined-basic'
          variant='outlined'
          fullWidth
          name='totalAnnualIncome'
          value={formatCurrency(totalAnnualIncome)}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
          onChange={({ target }) => handleChange(target.name, target.value)}
          onBlur={() =>
            handleChange('totalAnnualIncome', formatCurrency(totalAnnualIncome))
          }
        />
      </Box>
      <Slider
        handleChange={(_, value) =>
          handleChange('yearsIncomeReplacement', value)
        }
        max={30}
        leftLabel='year'
        rightLabel='years'
        min={1}
        step={1}
        value={parseInt(validYearsIncomeReplacement)}
        label='Years Income Replacement'
        toolTipText='We will use this to calculate the number of years of income the life insurance policy may need to replace.'
      />
    </CoverageCalculationsCard>
  );
};

TotalIncome.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  totalAnnualIncome: PropTypes.number,
  yearsIncomeReplacement: PropTypes.number.isRequired,
  contactId: PropTypes.string.isRequired,
};

export default TotalIncome;
