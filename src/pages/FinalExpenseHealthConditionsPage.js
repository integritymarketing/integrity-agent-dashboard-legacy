import { Helmet } from "react-helmet-async";

import FinalExpenseHealthConditionsContainer from "components/FinalExpenseHealthConditionsContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { useEffect } from "react";
import { LIFE_QUESTION_CARD_LIST } from "components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants";

const FinalExpenseHealthConditionsPage = () => {
    const { setSelectedLifeProductType } = useCreateNewQuote();

    useEffect(() => {
        setSelectedLifeProductType(LIFE_QUESTION_CARD_LIST.FINAL_EXPENSE);
    }, [setSelectedLifeProductType]);

    return (
        <>
            <Helmet>
                <title>Integrity - Final Expenses Health Conditions</title>
            </Helmet>
            <GlobalNav />
            <FinalExpenseHealthConditionsContainer />
            <GlobalFooter />
        </>
    );
};

export default FinalExpenseHealthConditionsPage;
