import { CustomModal } from 'components/MuiComponents';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import SelectProduct from '../SelectProduct';
import QuoteModalCard from '../Common/QuoteModalCard';
import LifeForm from '../LifeForm';
import ZipcodeForm from '../ZipcodeForm';
import SelectLifeProduct from '../SelectLifeProduct';
import SelectIulProduct from '../SelectIulProduct';
import IulAccumulationForm from '../IulAccumulationForm';
import IulProtectionForm from '../IulProtectionForm';
import WithLoader from 'components/ui/WithLoader';
import { useNavigate, useLocation } from 'react-router-dom';

const StartQuoteModal = () => {
  const {
    showStartQuoteModal: open,
    setShowStartQuoteModal: handleClose,
    quoteModalStage,
    setQuoteModalStage,
    showUpArrow,
    handleSelectLifeProductType,
    handleSelectIulGoalType,
    quickQuoteLeadId,
    isLoadingGetQuickQuoteLeadId,
    handleBackFromLifeIntakeForm,
  } = useCreateNewQuote();

  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const createQuote = searchParams.get('create-quote');

  const onClose = () => {
    if (createQuote) {
      navigate('/contacts/list');
    }
    setQuoteModalStage('');
    handleClose(false);
  };

  return (
    <CustomModal
      title={quoteModalStage === "selectProductTypeCard" ? 'Quick Quote' : ''}
      open={open}
      handleClose={onClose}
      showCloseButton
      maxWidth='sm'
      disableContentBackground
    >
      <WithLoader isLoading={isLoadingGetQuickQuoteLeadId}>
        {quoteModalStage === 'selectProductTypeCard' && (
          <QuoteModalCard>
            <SelectProduct setQuoteModalStage={setQuoteModalStage} />
          </QuoteModalCard>
        )}
      </WithLoader>

      {quoteModalStage === 'lifeQuestionCard' && (
        <QuoteModalCard
          action={
            showUpArrow
              ? () => setQuoteModalStage('selectProductTypeCard')
              : null
          }
        >
          <SelectLifeProduct
            handleSelectLifeProductType={handleSelectLifeProductType}
            quickQuoteLeadId={quickQuoteLeadId}
            onClose={onClose}
          />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'iulGoalCard' && (
        <QuoteModalCard action={() => setQuoteModalStage('lifeQuestionCard')}>
          <SelectIulProduct handleSelectIulGoal={handleSelectIulGoalType} />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'finalExpenseIntakeFormCard' && (
        <QuoteModalCard action={() => handleBackFromLifeIntakeForm()}>
          <LifeForm />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'IulAccummulationForm' && (
        <QuoteModalCard action={() => setQuoteModalStage('iulGoalCard')}>
          <IulAccumulationForm />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'IulProtectionForm' && (
        <QuoteModalCard action={() => setQuoteModalStage('iulGoalCard')}>
          <IulProtectionForm />
        </QuoteModalCard>
      )}

      {quoteModalStage === 'zipCodeInputCard' && (
        <QuoteModalCard
          action={() => setQuoteModalStage('selectProductTypeCard')}
        >
          <ZipcodeForm />
        </QuoteModalCard>
      )}
    </CustomModal>
  );
};

export default StartQuoteModal;
