import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import IulProtectionQuoteDetails from "components/LifeIulQuote/IulProtectionQuoteDetails";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const IulProtectionQuoteDetailsPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Protection Quote Details Page</title>
            </Helmet>
            <GlobalNav />
            <StyledBox>
                <IulProtectionQuoteDetails />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulProtectionQuoteDetailsPage;