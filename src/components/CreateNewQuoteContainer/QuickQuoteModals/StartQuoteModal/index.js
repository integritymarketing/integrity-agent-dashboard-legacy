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
                    <QuoteModalCard action={() => setQuoteModalStage("selectProductTypeCard")}>
                        <FinalExpenseIntakeFormCard />
                    </QuoteModalCard>
                )}

                {quoteModalStage === "zipCodeInputCard" && (
                    <QuoteModalCard action={() => setQuoteModalStage("selectProductTypeCard")}>
                        <ZipCodeInputCard />
                    </QuoteModalCard>
                )}
            </CustomModal>
        </>
    );
};

export default StartQuoteModal;
