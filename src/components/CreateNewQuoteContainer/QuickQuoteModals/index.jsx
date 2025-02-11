import AutoCompleteContactSearchModal from "./AutoCompleteContactSearch";
import CreateNewContactModal from "./CreateNewContactModal";
import StartQuoteModal from "./StartQuoteModal";
import { useCreateNewQuote } from "providers/CreateNewQuote";

export const QuickQuoteModals = () => {
    const { contactSearchModalOpen, createNewContactModalOpen, showStartQuoteModal } = useCreateNewQuote();

    return (
        <>
            {contactSearchModalOpen && <AutoCompleteContactSearchModal />}
            {createNewContactModalOpen && <CreateNewContactModal />}
            {showStartQuoteModal && <StartQuoteModal />}
        </>
    );
};
