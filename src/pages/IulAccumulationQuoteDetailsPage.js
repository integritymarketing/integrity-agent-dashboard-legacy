import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import IulAccumulationQuoteDetails from "components/LifeIulQuote/IulAccumulationQuoteDetails";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const IulAccumulationQuoteDetailsPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Accumulation Quote Page</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <IulAccumulationQuoteDetails />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulAccumulationQuoteDetailsPage;
