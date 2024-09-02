import { CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";

import SelectProductCard from "../SelectProductCard";
import QuoteModalCard from "../../Common/QuoteModalCard";

import FinalExpenseIntakeFormCard from "../FinalExpenseIntakeFormCard";
import ZipCodeInputCard from "../ZipCodeInputCard";
import LifeQuestionCard from "../LifeQuestionCard";
import { useEffect, useState } from "react";
import { GET_COUNTIES } from "components/AddZipContainer/AddZipContainer.constants";
import useFetch from "hooks/useFetch";

const StartQuoteModal = () => {
    const [isMultipleCounties, setIsMultipleCounties] = useState(false);
    const {
        showStartQuoteModal: open,
        setShowStartQuoteModal: handleClose,
        quoteModalStage,
        setQuoteModalStage,
        showUpArrow,
        IUL_FEATURE_FLAG,
        selectedLead,
        handleSelectLifeProductType,
    } = useCreateNewQuote();

    const zipcode = selectedLead?.addresses?.[0]?.postalCode;
    const URL = `${GET_COUNTIES}${zipcode}`;
    const { Get: getCounties } = useFetch(URL);
    const county = selectedLead?.addresses?.[0]?.county;

    useEffect(() => {
        async function getCountiesData() {
            const counties = await getCounties();
            if (counties?.length > 1 && !county) {
                setIsMultipleCounties(true);
            } else {
                setIsMultipleCounties(false);
            }
        }

        if (!county) {
            getCountiesData();
        }
    }, [URL, county, getCounties]);

    const onClose = () => {
        handleClose(false);
    };

    return (
        <>
            <CustomModal
                title={"Select a Product"}
                open={open}
                handleClose={onClose}
                showCloseButton
                maxWidth="sm"
                disableContentBackground
            >
                {quoteModalStage === "selectProductTypeCard" && (
                    <QuoteModalCard>
                        <SelectProductCard isMultipleCounties={isMultipleCounties} />
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
                                ? () =>
                                      setQuoteModalStage(
                                          IUL_FEATURE_FLAG ? "lifeQuestionCard" : "selectProductTypeCard"
                                      )
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
        </>
    );
};

export default StartQuoteModal;
