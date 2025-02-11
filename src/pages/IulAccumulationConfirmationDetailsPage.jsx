import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import { IulAccumulationConfirmationDetailForm } from "components/LifeForms/IulAccumulation";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const IulAccumulationConfirmationDetailsPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Accumulation Create Quote</title>
            </Helmet>
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
            <StyledBox>
                <IulAccumulationConfirmationDetailForm />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulAccumulationConfirmationDetailsPage;
