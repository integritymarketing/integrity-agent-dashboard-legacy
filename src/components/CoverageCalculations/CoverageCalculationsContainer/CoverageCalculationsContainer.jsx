import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import HouseholdDebt from '../HouseholdDebt';
import TotalIncome from '../TotalIncome';
import RemainingMortgageAmount from '../RemainingMortgageAmount';
import EducationExpense from '../EducationExpense';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { Box, CircularProgress } from '@mui/material';
import { useLeadDetails } from 'providers/ContactDetails';
import ReviewCurrentAssets from '../ReviewCurrentAssets';
import CoverageReview from '../CoverageReview';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import ConditionalProfileBar from 'components/QuickerQuote/Common/ConditionalProfileBar';

const CoverageCalculationsContainer = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { isQuickQuotePage, setQuoteModalStage, setShowStartQuoteModal } =
    useCreateNewQuote();

  const {
    getFinancialNeedsAnalysis,
    isLoadingFinancialNeedsAnalysis,
    financialNeedsAnalysis,
    setFinancialNeedsAnalysis,
  } = useCoverageCalculationsContext();

  const { isLoadingLeadDetails, leadDetails } = useLeadDetails();
  const hasFna = leadDetails?.hasFna;

  const [currentStep, setCurrentStep] = useState(1);

  const sessionCurrentPage = sessionStorage.getItem('currentCalculationStep');

  useEffect(() => {
    setCurrentStep(sessionCurrentPage ? parseInt(sessionCurrentPage) : 1);
  }, [sessionCurrentPage]);

  const [formValue, setFormValues] = useState({});

  useEffect(() => {
    if (isQuickQuotePage && currentStep === 6) {
      return;
    }
    if (!hasFna || (isQuickQuotePage && currentStep !== 6)) {
      setFormValues(null);
      setFinancialNeedsAnalysis(null);
      return;
    }
    getFinancialNeedsAnalysis(contactId);
  }, [
    getFinancialNeedsAnalysis,
    hasFna,
    setFinancialNeedsAnalysis,
    isQuickQuotePage,
    contactId,
    currentStep,
  ]);

  useEffect(() => {
    setFormValues({
      ...financialNeedsAnalysis,
      yearsIncomeReplacement:
        financialNeedsAnalysis?.yearsIncomeReplacement || 10,
      remainingMortgageAmount:
        financialNeedsAnalysis?.remainingMortgageAmount ||
        financialNeedsAnalysis?.remainingMortgageAmount === 0
          ? financialNeedsAnalysis?.remainingMortgageAmount
          : 200000,
      shouldCoverCollegeExpenses:
        financialNeedsAnalysis?.shouldCoverCollegeExpenses
          ? 'Yes'
          : financialNeedsAnalysis?.shouldCoverCollegeExpenses === false
          ? 'No'
          : '',
    });
  }, [financialNeedsAnalysis]);

  const handleNext = useCallback(() => {
    if (currentStep === 6) {
      if (isQuickQuotePage) {
        setShowStartQuoteModal(true);
        setQuoteModalStage('selectProductTypeCard');
      } else {
        navigate(`/contact/${contactId}/overview`, {
          state: { showProductCategoryModal: true },
        });
      }
    } else {
      const next = currentStep + 1;
      setCurrentStep(next);
      sessionStorage.setItem('currentCalculationStep', next);
    }
  }, [currentStep, navigate, getFinancialNeedsAnalysis]);

  const handleBack = useCallback(() => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
    sessionStorage.setItem('currentCalculationStep', prev);
  }, [currentStep]);

  const handleChange = useCallback((name, value) => {
    let sanitizedValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(sanitizedValue)) {
      sanitizedValue = undefined;
    }

    if (sanitizedValue < 0 || sanitizedValue > 999999999) {
      return;
    }

    setFormValues(prevFormValues => ({
      ...prevFormValues,
      [name]: sanitizedValue,
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

  const resetCurrentStep = () => {
    setCurrentStep(1);
  };

  if (
    isLoadingFinancialNeedsAnalysis ||
    (isLoadingLeadDetails && !isQuickQuotePage)
  ) {
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
      <ConditionalProfileBar
        leadId={contactId}
        page='fnaPage'
        hideButton={true}
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
          originalValue={financialNeedsAnalysis?.remainingMortgageAmount}
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
      {currentStep === 6 && (
        <CoverageReview
          handleBack={handleBack}
          handleNext={handleNext}
          contactId={contactId}
          handleChange={handleChange}
          resetCurrentStep={resetCurrentStep}
          yearsIncomeReplacement={formValue?.yearsIncomeReplacement || 10}
          educationNeedPerChild={formValue?.educationNeedPerChild || 150000}
        />
      )}
    </>
  );
};

export default CoverageCalculationsContainer;
