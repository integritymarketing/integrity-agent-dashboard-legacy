import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import { FinalExpensePlansContainer } from "components/FinalExpensePlansContainer";

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
                <title>Integrity Clients - Final Expenses Create Quote</title>
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
