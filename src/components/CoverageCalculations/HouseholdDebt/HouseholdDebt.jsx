import {
  Box,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import PropTypes from 'prop-types';
import { formatCurrency } from 'utils/shared-utils/sharedUtility';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useCallback } from 'react';

const HouseholdDebt = ({ handleChange, handleNext, value, contactId }) => {
  const {
    updateFinancialNeedsAnalysis,
    isFinancialNeedsAnalysisUpdating,
    financialNeedsAnalysis,
  } = useCoverageCalculationsContext();

  const onContinue = useCallback(async () => {
    if (financialNeedsAnalysis?.totalHouseholdDebt === value) {
      handleNext();
      return;
    }

    const response = await updateFinancialNeedsAnalysis(contactId, {
      totalHouseholdDebt: value,
    });

    if (response) {
      handleNext();
    }
  }, [
    value,
    updateFinancialNeedsAnalysis,
    contactId,
    financialNeedsAnalysis,
    handleNext,
  ]);

  const handleNoDebtClick = useCallback(async () => {
    const response = await updateFinancialNeedsAnalysis(contactId, {
      totalHouseholdDebt: 0,
    });

    if (response) {
      handleChange('totalHouseholdDebt', 0);
      handleNext();
    }
  }, [updateFinancialNeedsAnalysis, contactId, handleNext, handleChange]);

  const handleSkip = useCallback(async () => {
    if (value === null || value === undefined || value === '') {
      const response = await updateFinancialNeedsAnalysis(contactId, {
        totalHouseholdDebt: null,
      });

      if (response) {
        handleNext();
      }
    } else {
      handleNext();
    }
  }, [updateFinancialNeedsAnalysis, contactId, handleNext, value]);

  const isContinueButtonDisabled =
    isFinancialNeedsAnalysisUpdating ||
    value === null ||
    value === undefined ||
    value === '';

  return (
    <CoverageCalculationsCard
      title={
        <Typography variant='h3' color='#052A63'>
          Let's go over debt.
        </Typography>
      }
      subTitle='Include all debts, such as mortgages, student loans, car loans, credit cards, etc.'
      onContinue={onContinue}
      onSkip={handleSkip}
      isContinueButtonDisabled={isContinueButtonDisabled}
    >
      <Box my={4}>
        <Typography fontWeight='600' mb={1} color='#052A63'>
          Total Household Debt
        </Typography>
        <TextField
          id='outlined-basic'
          variant='outlined'
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
          value={
            value !== null && value !== undefined ? formatCurrency(value) : ''
          }
          name='totalHouseholdDebt'
          onChange={({ target }) => handleChange(target.name, target.value)}
        />
      </Box>

      {value === null || value === undefined || value === '' ? (
        <Box textAlign='center'>
          <Link
            href='#'
            underline='none'
            onClick={e => {
              e.preventDefault();
              handleNoDebtClick();
            }}
          >
            I currently don't have any debts.
          </Link>
        </Box>
      ) : null}
    </CoverageCalculationsCard>
  );
};

HouseholdDebt.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  contactId: PropTypes.number.isRequired,
};

export default HouseholdDebt;
