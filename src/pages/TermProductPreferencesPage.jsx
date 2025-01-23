import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import { TermProductPreferenceForm } from "components/LifeForms";
import { QUOTE_TYPE_LABEL } from "components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants";

const StyledBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f1f1f1",
}));

const TermProductPreferencesPage = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - Term Product Preference</title>
            </Helmet>
            <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
            <StyledBox>
                <TermProductPreferenceForm />
            </StyledBox>
            <GlobalFooter />
        </>
    );
};

export default TermProductPreferencesPage;
