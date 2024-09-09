import { useEffect } from "react";
import { CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import SelectProductCard from "../SelectProductCard";
import QuoteModalCard from "../../Common/QuoteModalCard";
import FinalExpenseIntakeFormCard from "../FinalExpenseIntakeFormCard";
import ZipCodeInputCard from "../ZipCodeInputCard";
import LifeQuestionCard from "../LifeQuestionCard";
import { useLeadDetails } from "providers/ContactDetails";
import * as Sentry from "@sentry/react";

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
        countiesData,
    } = useCreateNewQuote();
    const { updateLeadDetailsWithZipCode } = useLeadDetails();

    useEffect(() => {
        const updateCountyDetails = async () => {
            try {
                await fetchCountiesData();
                if (countiesData?.length === 1) {
                    const payload = {
                        ...selectedLead,
                        addresses: [
                            {
                                ...selectedLead?.addresses?.[0],
                                county: countiesData[0]?.countyName,
                                countyFips: countiesData[0]?.countyFIPS,
                                stateCode: countiesData[0]?.state,
                            },
                        ],
                    };

                    await updateLeadDetailsWithZipCode(payload);
                }
            } catch (error) {
                Sentry.captureException(error);
            }
        };

        if (!selectedLead?.addresses?.[0]?.county) {
            updateCountyDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLead, fetchCountiesData, updateLeadDetailsWithZipCode, countiesData?.length]);

    const onClose = () => {
        handleClose(false);
    };

    return (
        <CustomModal
            title="Select a Product"
            open={open}
            handleClose={onClose}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
        >
            {quoteModalStage === "selectProductTypeCard" && (
                <QuoteModalCard>
                    <SelectProductCard
                        setQuoteModalStage={setQuoteModalStage}
                        isMultipleCounties={isMultipleCounties}
                    />
                </QuoteModalCard>
            )}

            {quoteModalStage === "lifeQuestionCard" && (
                <QuoteModalCard action={showUpArrow ? () => setQuoteModalStage("selectProductTypeCard") : null}>
                    <LifeQuestionCard
                        IUL_FEATURE_FLAG={IUL_FEATURE_FLAG}
                        handleSelectLifeProductType={handleSelectLifeProductType}
                    />
                </QuoteModalCard>
            )}

            {quoteModalStage === "finalExpenseIntakeFormCard" && (
                <QuoteModalCard
                    action={
                        showUpArrow
                            ? () => setQuoteModalStage(IUL_FEATURE_FLAG ? "lifeQuestionCard" : "selectProductTypeCard")
                            : null
                    }
                >
                    <FinalExpenseIntakeFormCard />
                </QuoteModalCard>
            )}

            {quoteModalStage === "zipCodeInputCard" && (
                <QuoteModalCard action={showUpArrow ? () => setQuoteModalStage("selectProductTypeCard") : null}>
                    <ZipCodeInputCard />
                </QuoteModalCard>
            )}
        </CustomModal>
    );
};

export default StartQuoteModal;
