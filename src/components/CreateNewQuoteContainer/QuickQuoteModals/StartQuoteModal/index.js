import { CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";

import SelectProductCard from "../SelectProductCard";
import QuoteModalCard from "../../Common/QuoteModalCard";
import LifeQuestionCard from "../LifeQuestionCard";
import HealthQuestionCard from "../HealthQuestionCard";
import IulGoalQuestionCard from "../IulGoalQuestionCard";
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
                maxWidth="md"
                disableContentBackground
            >
                {quoteModalStage === "selectProductTypeCard" && (
                    <QuoteModalCard>
                        <SelectProductCard />
                    </QuoteModalCard>
                )}
                {quoteModalStage === "lifeQuestionCard" && (
                    <QuoteModalCard action={() => setQuoteModalStage("selectProductTypeCard")}>
                        <LifeQuestionCard />
                    </QuoteModalCard>
                )}
                {quoteModalStage === "healthQuestionCard" && (
                    <QuoteModalCard action={() => setQuoteModalStage("selectProductTypeCard")}>
                        <HealthQuestionCard />
                    </QuoteModalCard>
                )}
                {quoteModalStage === "IulGoalQuestionCard" && (
                    <QuoteModalCard action={() => setQuoteModalStage("lifeQuestionCard")}>
                        <IulGoalQuestionCard />
                    </QuoteModalCard>
                )}
                {quoteModalStage === "finalExpenseIntakeFormCard" && (
                    <QuoteModalCard action={() => setQuoteModalStage("lifeQuestionCard")}>
                        <FinalExpenseIntakeFormCard />
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