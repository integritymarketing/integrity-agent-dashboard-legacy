import StartQuote from '../StartQuote';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

export const QuickQuoteModals = () => {
  const { showStartQuoteModal } = useCreateNewQuote();

  return <>{showStartQuoteModal && <StartQuote />}</>;
};
