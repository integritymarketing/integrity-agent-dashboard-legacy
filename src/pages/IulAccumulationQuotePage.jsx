import { Helmet } from "react-helmet-async";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import IulAccumulationQuote from "components/LifeIulQuote/IulAccumulations";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";
const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const IulAccumulationQuotePage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Accumulation Quote Page</title>
            </Helmet>
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
            <StyledBox>
                <IulAccumulationQuote />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulAccumulationQuotePage;
