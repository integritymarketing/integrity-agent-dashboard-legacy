import StartQuote from '../StartQuote';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import NoProductsSelectedModal from 'components/ContactDetailsContainer/NoProductsSelectedModal';

export const QuickQuoteModals = () => {
  const {
    showStartQuoteModal,
    isNoProductsSelectedModalOpen,
    setIsNoProductsSelectedModalOpen,
  } = useCreateNewQuote();

  return (
    <>
      {showStartQuoteModal && <StartQuote />}
      {isNoProductsSelectedModalOpen && (
        <NoProductsSelectedModal
          open={isNoProductsSelectedModalOpen}
          handleClose={() => setIsNoProductsSelectedModalOpen(false)}
        />
      )}
    </>
  );
};
