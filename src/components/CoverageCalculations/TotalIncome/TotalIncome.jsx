import PropTypes from 'prop-types';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { Slider } from '@integritymarketing/clients-ui-kit';
import { formatCurrency } from 'utils/shared-utils/sharedUtility';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useCallback } from 'react';
import { onlyNumbers } from 'utils/shared-utils/sharedUtility';

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
      totalAnnualIncome === financialNeedsAnalysis?.totalAnnualIncome &&
      yearsIncomeReplacement === financialNeedsAnalysis?.yearsIncomeReplacement
    ) {
      handleNext();
      return;
    }

    const payload = {
      totalAnnualIncome:
        totalAnnualIncome === null ||
        totalAnnualIncome === undefined ||
        totalAnnualIncome === ''
          ? null
          : totalAnnualIncome,
      yearsIncomeReplacement:
        totalAnnualIncome === null ||
        totalAnnualIncome === undefined ||
        totalAnnualIncome === ''
          ? null
          : yearsIncomeReplacement,
    };

    const response = await updateFinancialNeedsAnalysis(contactId, payload);

    if (response) {
      handleNext();
    }
  }, [
    totalAnnualIncome,
    yearsIncomeReplacement,
    updateFinancialNeedsAnalysis,
    contactId,
    handleNext,
  ]);

  const handleSkip = useCallback(async () => {
    if (
      totalAnnualIncome !== null &&
      totalAnnualIncome !== undefined &&
      totalAnnualIncome !== ''
    ) {
      handleNext();
      return;
    }

    // If no value exists, send null values in the API call
    const payload = {
      totalAnnualIncome: null,
      yearsIncomeReplacement: null,
    };

    const response = await updateFinancialNeedsAnalysis(contactId, payload);

    if (response) {
      handleNext();
    }
  }, [totalAnnualIncome, updateFinancialNeedsAnalysis, contactId, handleNext]);

  const validYearsIncomeReplacement =
    yearsIncomeReplacement != null &&
    yearsIncomeReplacement >= 1 &&
    yearsIncomeReplacement <= 20
      ? yearsIncomeReplacement
      : 10;

  const isContinueButtonDisabled =
    isFinancialNeedsAnalysisUpdating ||
    totalAnnualIncome === null ||
    totalAnnualIncome === undefined ||
    totalAnnualIncome === '';

  const handleInputChange = ({ target }) => {
    const rawValue = target.value.replace(/[^0-9]/g, '');
    const formattedValue = rawValue ? formatCurrency(rawValue) : '';
    handleChange(target.name, rawValue);
  };

  return (
    <CoverageCalculationsCard
      title={
        <Typography variant='h3' color='#052A63'>
          Now let's go over income.
        </Typography>
      }
      subTitle='Please enter their annual income sources may receive from any source.'
      onContinue={onContinue}
      onSkip={handleSkip}
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
          value={
            totalAnnualIncome !== null && totalAnnualIncome !== undefined
              ? formatCurrency(totalAnnualIncome)
              : ''
          }
          onKeyDown={onlyNumbers}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
          onChange={handleInputChange}
          onBlur={() =>
            handleChange('totalAnnualIncome', formatCurrency(totalAnnualIncome))
          }
        />
      </Box>
      <Slider
        handleChange={(_, value) =>
          handleChange('yearsIncomeReplacement', value)
        }
        max={20}
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
  totalAnnualIncome: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  yearsIncomeReplacement: PropTypes.number,
  contactId: PropTypes.string.isRequired,
};

export default TotalIncome;
