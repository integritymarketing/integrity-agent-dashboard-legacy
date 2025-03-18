import { useEffect } from 'react';
import { CustomModal } from 'components/MuiComponents';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import SelectProductCard from '../SelectProductCard';
import QuoteModalCard from '../../Common/QuoteModalCard';
import FinalExpenseIntakeFormCard from '../FinalExpenseIntakeFormCard';
import ZipCodeInputCard from '../ZipCodeInputCard';
import LifeQuestionCard from '../LifeQuestionCard';
import IulGoalQuestionCard from '../IulGoalQuestionCard';
import { useLeadDetails } from 'providers/ContactDetails';

const StartQuoteModal = () => {
  const {
    showStartQuoteModal: open,
    setShowStartQuoteModal: handleClose,
    quoteModalStage,
    setQuoteModalStage,
    showUpArrow,
    IUL_FEATURE_FLAG,
    selectedLead,
    handleSelectLifeProductType,
    fetchCountiesData,
    isMultipleCounties,
    handleSelectIulGoalType,
  } = useCreateNewQuote();

  const { isLoadingLeadDetails } = useLeadDetails();

  useEffect(() => {
    if (!selectedLead?.addresses?.[0]?.county) {
      fetchCountiesData();
    }
  }, [selectedLead, fetchCountiesData]);

  const onClose = () => {
    handleClose(false);
  };

  return (
    <CustomModal
      title='Select a Product Category'
      open={open}
      handleClose={onClose}
      showCloseButton
      maxWidth='sm'
      disableContentBackground
    >
      {quoteModalStage === 'selectProductTypeCard' && (
        <QuoteModalCard>
          <SelectProductCard
            setQuoteModalStage={setQuoteModalStage}
            isMultipleCounties={isMultipleCounties}
          />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'lifeQuestionCard' && (
        <QuoteModalCard
          action={
            showUpArrow
              ? () => setQuoteModalStage('selectProductTypeCard')
              : null
          }
        >
          <LifeQuestionCard
            IUL_FEATURE_FLAG={IUL_FEATURE_FLAG}
            handleSelectLifeProductType={handleSelectLifeProductType}
          />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'iulGoalCard' && (
        <QuoteModalCard
          action={
            showUpArrow ? () => setQuoteModalStage('lifeQuestionCard') : null
          }
        >
          <IulGoalQuestionCard
            IUL_FEATURE_FLAG={IUL_FEATURE_FLAG}
            handleSelectIulGoal={handleSelectIulGoalType}
          />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'finalExpenseIntakeFormCard' && (
        <QuoteModalCard
          action={
            showUpArrow && !isLoadingLeadDetails
              ? () =>
                  setQuoteModalStage(
                    IUL_FEATURE_FLAG
                      ? 'lifeQuestionCard'
                      : 'selectProductTypeCard'
                  )
              : null
          }
        >
          <FinalExpenseIntakeFormCard />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'zipCodeInputCard' && (
        <QuoteModalCard
          action={
            showUpArrow && !isLoadingLeadDetails
              ? () => setQuoteModalStage('selectProductTypeCard')
              : null
          }
        >
          <ZipCodeInputCard />
        </QuoteModalCard>
      )}
    </CustomModal>
  );
};

export default StartQuoteModal;
