import { CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";

import SelectProductCard from "../SelectProductCard";
import QuoteModalCard from "../../Common/QuoteModalCard";
import HealthQuestionCard from "../HealthQuestionCard";
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
                {quoteModalStage === "healthQuestionCard" && (
                    <QuoteModalCard action={() => setQuoteModalStage("selectProductTypeCard")}>
                        <HealthQuestionCard />
                    </QuoteModalCard>
                )}
                {quoteModalStage === "zipCodeInputCard" && (
                    <QuoteModalCard action={() => setQuoteModalStage("healthQuestionCard")}>
                        <ZipCodeInputCard />
                    </QuoteModalCard>
                )}
            </CustomModal>
        </>
    );
};

export default StartQuoteModal;
