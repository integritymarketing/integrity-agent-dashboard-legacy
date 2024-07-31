import { CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";

import SelectProductCard from "../SelectProductCard";
import QuoteModalCard from "../../Common/QuoteModalCard";

import FinalExpenseIntakeFormCard from "../FinalExpenseIntakeFormCard";
import ZipCodeInputCard from "../ZipCodeInputCard";

const StartQuoteModal = () => {
    const {
        showStartQuoteModal: open,
        setShowStartQuoteModal: handleClose,
        quoteModalStage,
        setQuoteModalStage,
        showUpArrow,
    } = useCreateNewQuote();

    const onClose = () => {
        handleClose(false);
    };

    return (
        <>
            <CustomModal
                title={"Start a Quote"}
                open={open}
                handleClose={onClose}
                showCloseButton
                maxWidth="sm"
                disableContentBackground
            >
                {quoteModalStage === "selectProductTypeCard" && (
                    <QuoteModalCard>
                        <SelectProductCard />
                    </QuoteModalCard>
                )}

                {quoteModalStage === "finalExpenseIntakeFormCard" && (
                    <QuoteModalCard action={showUpArrow ? () => setQuoteModalStage("selectProductTypeCard") : null}>
                        <FinalExpenseIntakeFormCard />
                    </QuoteModalCard>
                )}

                {quoteModalStage === "zipCodeInputCard" && (
                    <QuoteModalCard action={showUpArrow ? () => setQuoteModalStage("selectProductTypeCard") : null}>
                        <ZipCodeInputCard />
                    </QuoteModalCard>
                )}
            </CustomModal>
        </>
    );
};

export default StartQuoteModal;
