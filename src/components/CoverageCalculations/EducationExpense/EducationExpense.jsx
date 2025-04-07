import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import PropTypes from 'prop-types';
import { SelectableButtonGroup } from '@integritymarketing/clients-ui-kit';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useCallback } from 'react';
import { onlyNumbers } from 'utils/shared-utils/sharedUtility';
import * as Sentry from '@sentry/react';

import styles from './EducationExpense.module.scss';

const EducationExpense = ({
  handleBack,
  ageYoungestChild,
  shouldCoverCollegeExpenses,
  childrenUnderEighteen,
  contactId,
  handleUpdateStringsWithoutConvertion,
  handleNext,
}) => {
  const {
    updateFinancialNeedsAnalysis,
    isFinancialNeedsAnalysisUpdating,
    financialNeedsAnalysis,
  } = useCoverageCalculationsContext();

  const onContinue = useCallback(async () => {
    if (
      financialNeedsAnalysis?.ageYoungestChild === ageYoungestChild &&
      financialNeedsAnalysis?.shouldCoverCollegeExpenses ===
        (shouldCoverCollegeExpenses === 'Yes') &&
      financialNeedsAnalysis?.childrenUnderEighteen === childrenUnderEighteen
    ) {
      sessionStorage.removeItem('currentCalculationStep');
      handleNext();
      return;
    }

    try {
      const response = await updateFinancialNeedsAnalysis(contactId, {
        ageYoungestChild,
        shouldCoverCollegeExpenses: shouldCoverCollegeExpenses === 'Yes',
        childrenUnderEighteen,
      });

      if (response) {
        sessionStorage.removeItem('currentCalculationStep');
        handleNext();
      } else {
        console.error('Failed to update financial needs analysis');
        Sentry.captureException(
          new Error('Failed to update financial needs analysis')
        );
      }
    } catch (error) {
      console.error('Error during PATCH call:', error);
      Sentry.captureException(error);
    }
  }, [
    ageYoungestChild,
    shouldCoverCollegeExpenses,
    childrenUnderEighteen,
    updateFinancialNeedsAnalysis,
    contactId,
    financialNeedsAnalysis,
    handleNext,
  ]);

  const handleSkip = useCallback(async () => {
    if (
      ageYoungestChild !== null &&
      ageYoungestChild !== undefined &&
      ageYoungestChild !== ''
    ) {
      handleNext();
      return;
    }
    const payload = {
      ageYoungestChild: null,
      shouldCoverCollegeExpenses: null,
      childrenUnderEighteen: null,
    };
    const response = await updateFinancialNeedsAnalysis(contactId, payload);
    if (response) {
      handleNext();
    }
  }, [ageYoungestChild, updateFinancialNeedsAnalysis, contactId, handleNext]);

  const isAgeYoungestChildUnderEighteen = useMemo(() => {
    return (
      ageYoungestChild &&
      !isNaN(parseInt(ageYoungestChild)) &&
      parseInt(ageYoungestChild) <= 18
    );
  }, [ageYoungestChild]);

  const showErrorMessage = useMemo(() => {
    return (
      ageYoungestChild &&
      !isNaN(parseInt(ageYoungestChild)) &&
      parseInt(ageYoungestChild) > 18
    );
  }, [ageYoungestChild]);

  const isContinueButtonDisabled =
    isFinancialNeedsAnalysisUpdating ||
    !ageYoungestChild ||
    shouldCoverCollegeExpenses === '' ||
    !childrenUnderEighteen ||
    !isAgeYoungestChildUnderEighteen;

  return (
    <CoverageCalculationsCard
      title='What do they expect to spend on education?'
      subTitle='We’ll add the amount per child based on the average cost of a four-year degree.'
      onContinue={onContinue}
      onSkip={handleSkip}
      showBackButton
      onBack={handleBack}
      isContinueButtonDisabled={isContinueButtonDisabled}
    >
      <Box my={4}>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item md={6} xs={12}>
            <Typography fontWeight='600' mb={1}>
              Number of children under 18
            </Typography>
            <Select
              displayEmpty
              fullWidth
              name='childrenUnderEighteen'
              onChange={({ target }) =>
                handleUpdateStringsWithoutConvertion(target.name, target.value)
              }
              defaultValue={childrenUnderEighteen}
            >
              {[...Array(20).keys()].map(num => (
                <MenuItem key={num + 1} value={num + 1}>
                  {num + 1}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography fontWeight='600' mb={1}>
              Age of youngest child
            </Typography>
            <TextField
              id='outlined-basic'
              variant='outlined'
              fullWidth
              onKeyDown={onlyNumbers}
              name='ageYoungestChild'
              value={ageYoungestChild}
              onChange={({ target }) =>
                handleUpdateStringsWithoutConvertion(target.name, target.value)
              }
            />
            {showErrorMessage && (
              <Typography variant='body1' color='#C81E27' marginTop='4px'>
                Supports up to 18
              </Typography>
            )}
          </Grid>
          <Grid item md={12}>
            <Typography fontWeight='600' mb={1}>
              Do they want to cover any college expenses?
            </Typography>
            <Box display='flex'>
              <SelectableButtonGroup
                buttonOptions={['Yes', 'No']}
                buttonClassNames={['Yes', 'No'].map(option =>
                  shouldCoverCollegeExpenses === option
                    ? styles.selectedOption
                    : styles.nonSelectedOption
                )}
                onSelect={selected => {
                  handleUpdateStringsWithoutConvertion(
                    'shouldCoverCollegeExpenses',
                    selected
                  );
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CoverageCalculationsCard>
  );
};

EducationExpense.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  ageYoungestChild: PropTypes.string.isRequired,
  shouldCoverCollegeExpenses: PropTypes.string.isRequired,
  childrenUnderEighteen: PropTypes.number.isRequired,
};

export default EducationExpense;
