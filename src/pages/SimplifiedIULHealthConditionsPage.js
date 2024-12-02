import { Helmet } from "react-helmet-async";

import FinalExpenseHealthConditionsContainer from "components/FinalExpenseHealthConditionsContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { useEffect } from "react";
import { LIFE_QUESTION_CARD_LIST } from "components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants";
import { useCreateNewQuote } from "providers/CreateNewQuote";

const SimplifiedIULHealthConditionsPage = () => {
    const { setSelectedLifeProductType } = useCreateNewQuote();

    useEffect(() => {
        setSelectedLifeProductType(LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE);
    }, [setSelectedLifeProductType]);

    return (
        <>
            <Helmet>
                <title>Integrity - Simplified IUL Health Conditions</title>
            </Helmet>
            <GlobalNav />
            <FinalExpenseHealthConditionsContainer />
            <GlobalFooter />
        </>
    );
};

export default SimplifiedIULHealthConditionsPage;
