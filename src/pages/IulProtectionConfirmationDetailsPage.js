import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { IulProtectionConfirmationDetail } from "components/LifeForms";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";
const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f1f1f1",
}));

const IulProtectionConfirmationDetailsPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - IUL Protection Create Quote</title>
            </Helmet>
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
            <StyledBox>
                <IulProtectionConfirmationDetail />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default IulProtectionConfirmationDetailsPage;
