import { Helmet } from "react-helmet-async";

import FinalExpensePlansResultContainer from "components/FinalExpensePlansContainer/FinalExpensePlansResultContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { useEffect } from "react";
import { LIFE_QUESTION_CARD_LIST } from "components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";
const SimplifiedIULPlansPage = () => {
    const { setSelectedLifeProductType } = useCreateNewQuote();

    useEffect(() => {
        setSelectedLifeProductType(LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE);
    }, [setSelectedLifeProductType]);

    return (
        <>
            <Helmet>
                <title>Integrity - Simplified IUL Plans</title>
            </Helmet>
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
            <FinalExpensePlansResultContainer />
            <GlobalFooter />
        </>
    );
};

export default SimplifiedIULPlansPage;
