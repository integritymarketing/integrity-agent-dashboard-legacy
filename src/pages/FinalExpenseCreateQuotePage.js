import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import { FinalExpensePlansContainer } from "components/FinalExpensePlansContainer";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f1f1f1",
}));

const FinalExpensePlansPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - Final Expenses Create Quote</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <FinalExpensePlansContainer />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default FinalExpensePlansPage;
