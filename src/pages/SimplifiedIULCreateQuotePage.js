import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import { FinalExpensePlansContainer } from "components/FinalExpensePlansContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { useEffect } from "react";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { LIFE_QUESTION_CARD_LIST } from "components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f1f1f1",
}));

const SimplifiedIULCreateQuotePage = () => {
    const { setSelectedLifeProductType } = useCreateNewQuote();

    useEffect(() => {
        setSelectedLifeProductType(LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE);
    }, [setSelectedLifeProductType]);

    return (
        <>
            <Helmet>
                <title>Integrity - Simplified IUL Create Quote</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <FinalExpensePlansContainer />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default SimplifiedIULCreateQuotePage;
