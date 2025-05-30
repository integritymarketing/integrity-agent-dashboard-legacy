import { Helmet } from "react-helmet-async";

import FinalExpenseHealthConditionsContainer from "components/FinalExpenseHealthConditionsContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { useEffect } from "react";
import { LIFE_QUESTION_CARD_LIST } from "components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";
import HealthConditionsPageContainer from "components/HealthConditionsPageContainer";
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
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
            <HealthConditionsPageContainer />
            <GlobalFooter />
        </>
    );
};

export default SimplifiedIULHealthConditionsPage;
