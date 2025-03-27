import { useNavigate, useParams } from 'react-router-dom';
import { ContactProfileTabBar } from 'components/ContactDetailsContainer';
import { useCallback, useState } from 'react';
import HouseholdDebt from '../HouseholdDebt';
import TotalIncome from '../TotalIncome';
import RemainingMortgageAmount from '../RemainingMortgageAmount';
import EducationExpense from '../EducationExpense';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useLeadDetails } from 'providers/ContactDetails';
import ReviewCurrentAssets from '../ReviewCurrentAssets';

const CoverageCalculationsContainer = () => {
  const { contactId } = useParams();

  const {
    getFinancialNeedsAnalysis,
    isLoadingFinancialNeedsAnalysis,
    financialNeedsAnalysis,
  } = useCoverageCalculationsContext();

  const { isLoadingLeadDetails, leadDetails } = useLeadDetails();
  const hasFna = leadDetails?.hasFna;

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const sessionCurrentPage = sessionStorage.getItem('currentCalculationStep');
    setCurrentStep(sessionCurrentPage ? parseInt(sessionCurrentPage) : 1);
  }, [sessionStorage]);

  useEffect(() => {
    if (!hasFna) {
      return;
    }
    getFinancialNeedsAnalysis(contactId);
  }, [getFinancialNeedsAnalysis, hasFna]);

  const [formValue, setFormValues] = useState({});

  useEffect(() => {
    setFormValues({
      ...financialNeedsAnalysis,
      shouldCoverCollegeExpenses:
        financialNeedsAnalysis?.shouldCoverCollegeExpenses
          ? 'Yes'
          : financialNeedsAnalysis?.shouldCoverCollegeExpenses === false
          ? 'No'
          : '',
    });
  }, [financialNeedsAnalysis]);

  const handleNext = useCallback(() => {
    const next = currentStep + 1;
    setCurrentStep(next);
    sessionStorage.setItem('currentCalculationStep', next);
  }, [currentStep]);

  const handleBack = useCallback(() => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
    sessionStorage.setItem('currentCalculationStep', prev);
  }, [currentStep]);

  const handleChange = useCallback((name, value) => {
    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [name]:
        typeof value === 'string'
          ? value.length > 0
            ? parseFloat(value.toString().replace(/[^0-9.-]+/g, ''))
            : ''
          : value,
    }));
  }, []);

  const handleUpdateStringsWithoutConvertion = useCallback(
    (name, value) => {
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        [name]: value,
      }));
    },
    [setFormValues]
  );

  if (isLoadingFinancialNeedsAnalysis || isLoadingLeadDetails) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='50vh'
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <ContactProfileTabBar
        contactId={contactId}
        showTabs={false}
        backButtonLabel='Back'
        backButtonRoute={`/contact/${contactId}/overview`}
      />
      {currentStep === 1 && (
        <HouseholdDebt
          contactId={contactId}
          handleChange={handleChange}
          handleNext={handleNext}
          value={formValue?.totalHouseholdDebt}
        />
      )}
      {currentStep === 2 && (
        <TotalIncome
          contactId={contactId}
          handleBack={handleBack}
          handleChange={handleChange}
          handleNext={handleNext}
          totalAnnualIncome={formValue?.totalAnnualIncome}
          yearsIncomeReplacement={formValue?.yearsIncomeReplacement}
        />
      )}
      {currentStep === 3 && (
        <RemainingMortgageAmount
          contactId={contactId}
          handleBack={handleBack}
          handleChange={handleChange}
          handleNext={handleNext}
          remainingMortgageAmount={formValue?.remainingMortgageAmount}
        />
      )}
      {currentStep === 4 && (
        <EducationExpense
          handleBack={handleBack}
          handleUpdateStringsWithoutConvertion={
            handleUpdateStringsWithoutConvertion
          }
          handleNext={handleNext}
          childrenUnderEighteen={formValue?.childrenUnderEighteen}
          shouldCoverCollegeExpenses={formValue?.shouldCoverCollegeExpenses}
          ageYoungestChild={formValue?.ageYoungestChild}
          contactId={contactId}
        />
      )}
      {currentStep === 5 && (
        <ReviewCurrentAssets
          handleBack={handleBack}
          handleNext={handleNext}
          totalAvailableSavings={formValue?.totalAvailableSavings}
          contactId={contactId}
          handleChange={handleChange}
        />
      )}
    </>
  );
};

export default CoverageCalculationsContainer;
