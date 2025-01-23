import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import IulProtectionQuote from "components/LifeIulQuote/IulProtection";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const IulProtectionQuotePage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Protection Quote Page</title>
            </Helmet>
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
            <StyledBox>
                <IulProtectionQuote />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulProtectionQuotePage;
